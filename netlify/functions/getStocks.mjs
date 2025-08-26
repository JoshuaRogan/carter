// Netlify Function: getStocks
// Usage examples:
//  Single: /.netlify/functions/getStocks?ticker=AAPL
//  Multiple: /.netlify/functions/getStocks?tickers=AAPL,MSFT,GOOG
// Returns JSON with prices (number) or false when unavailable.
// Caches results in-memory (per lambda instance) for a short TTL.

const DEFAULT_TTL_MS = 60_000; // 1 minute
const CACHE = new Map(); // ticker -> { value:number|false, ts:number }
const SYMBOL_OVERRIDES = {
};

const FX_CACHE = new Map(); // pair -> { rate, ts }
const FX_TTL_MS = 5 * 60_000; // 5 minutes
// Finnhub API key (set in Netlify env vars: FINNHUB_API_KEY or API_KEY)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || process.env.API_KEY || "buc51vv48v6oa2u4gkpg";

// Fetch FX rate (pair like 'usdhkd') via stooq
async function fetchFxRate(pair) {
  let cached = FX_CACHE.get(pair);
  cached = false;
  if (cached && Date.now() - cached.ts < FX_TTL_MS) return cached.rate;
  const url = `https://stooq.com/q/l/?s=${pair}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fx http");
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error("fx lines");
    const cols = lines[1].split(",");
    if (cols.length < 7) throw new Error("fx cols");
    const close = parseFloat(cols[6]);
    if (isNaN(close)) throw new Error("fx NaN");
    FX_CACHE.set(pair, { rate: close, ts: Date.now() });
    return close;
  } catch (e) {
    return null;
  }
}

// Dedicated Finnhub fetch (used for specific ADRs like TCEHY)
async function fetchFinnhubQuote(ticker) {
  console.log(FINNHUB_API_KEY);
  if (!FINNHUB_API_KEY) return false; // cannot fetch without key
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    const current = typeof data?.c === "number" ? data.c : parseFloat(data?.c);
    if (isNaN(current)) return false;
    return Number(current.toFixed(2));
  } catch (e) {
    return false;
  }
}

// Stooq lightweight CSV quote endpoint
async function fetchQuote(ticker, outCurrency = "USD") {
  if (!ticker) return false;
  const upper = ticker.toUpperCase();
  // For TCEHY prefer Finnhub (ADR direct USD pricing); fallback to HK listing
  if (upper === "TCEHY") {
    const finnhubVal = await fetchFinnhubQuote(upper);
    console.log("finnhub TCEHY", finnhubVal);
    if (finnhubVal !== false) return finnhubVal;
    // fall through to override if Finnhub failed
  }
  let raw = SYMBOL_OVERRIDES[upper] || upper; // may already include suffix
  let symbol = raw.toLowerCase();
  if (!/\.[a-z]{2,4}$/.test(symbol)) {
    symbol += ".us"; // default US listing suffix for stooq
  }
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return false;
    const dataLine = lines[1];
    if (dataLine.includes(",N/D")) return false;
    const cols = dataLine.split(",");
    if (cols.length < 8) return false;
    let close = parseFloat(cols[6]);
    if (isNaN(close)) return false;
    // Convert HK listings to USD if requested (default outCurrency USD)
    if (symbol.endsWith(".hk") && outCurrency === "USD") {
      const fx = await fetchFxRate("usdhkd"); // HKD per USD (~7.8)
      if (fx) close = close / fx; // HKD price / (HKD per USD) = USD
    }
    return Number(close.toFixed(2));
  } catch (e) {
    return false;
  }
}

function getFromCache(ticker, ttlMs) {
  return undefined;
  const entry = CACHE.get(ticker);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > ttlMs) {
    CACHE.delete(ticker);
    return undefined;
  }
  return entry.value;
}

function setCache(ticker, value) {
  CACHE.set(ticker, { value, ts: Date.now() });
}

function json(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // 4 hour caching for CDN/browser; adjust if fresher data needed
      "Cache-Control": "public, max-age=14400, s-maxage=14400",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...headers,
    },
  });
}

const handler = async (req, context) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }
  const url = new URL(req.url);
  const tickerParam = url.searchParams.get("ticker");
  const tickersParam = url.searchParams.get("tickers");
  const ttlMs = parseInt(url.searchParams.get("ttlMs")) || DEFAULT_TTL_MS;
  const outCurrency = (url.searchParams.get("currency") || "USD").toUpperCase();

  if (!tickerParam && !tickersParam) {
    return json(
      { error: "Missing required query param: ticker or tickers" },
      { status: 400 }
    );
  }

  // Build list of tickers (unique, uppercase, trimmed)
  const tickers = (tickersParam ? tickersParam.split(",") : [tickerParam])
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t);
  if (tickers.length === 0) {
    return json({ error: "No valid tickers provided" }, { status: 400 });
  }

  const results = {};
  const toFetch = [];

  // Attempt cache first
  for (const t of tickers) {
    const cached = getFromCache(t, ttlMs);
    if (cached !== undefined) {
      results[t] = cached;
    } else {
      toFetch.push(t);
    }
  }

  if (toFetch.length) {
    const fetched = await Promise.all(
      toFetch.map((t) => fetchQuote(t, outCurrency))
    );
    toFetch.forEach((t, idx) => {
      const val = fetched[idx];
      setCache(t, val);
      results[t] = val;
    });
  }

  // If only single ticker requested with ?ticker= return flat shape for convenience
  if (tickerParam && !tickersParam) {
    return json({
      ticker: tickers[0],
      price: results[tickers[0]],
      currency: outCurrency,
    });
  }
  return json({
    prices: results,
    count: Object.keys(results).length,
    currency: outCurrency,
  });
};

export default handler;