// Netlify Function: getStocks
// Usage examples:
//  Single: /.netlify/functions/getStocks?ticker=AAPL
//  Multiple: /.netlify/functions/getStocks?tickers=AAPL,MSFT,GOOG
// Returns JSON with prices (number) or false when unavailable.
// Caches results in-memory (per lambda instance) for a short TTL.

const DEFAULT_TTL_MS = 60_000; // 1 minute
const CACHE = new Map(); // ticker -> { value:number|false, ts:number }
const SYMBOL_OVERRIDES = {
  TCEHY: '0700.HK' // Tencent ADR -> primary HK listing (HKD)
};

const FX_CACHE = new Map(); // pair -> { rate, ts }
const FX_TTL_MS = 5 * 60_000; // 5 minutes

async function fetchFxRate(pair) { // pair like 'usdhkd'
  const cached = FX_CACHE.get(pair);
  if (cached && Date.now() - cached.ts < FX_TTL_MS) return cached.rate;
  const url = `https://stooq.com/q/l/?s=${pair}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('fx http');
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error('fx lines');
    const cols = lines[1].split(',');
    if (cols.length < 7) throw new Error('fx cols');
    const close = parseFloat(cols[6]);
    if (isNaN(close)) throw new Error('fx NaN');
    FX_CACHE.set(pair, { rate: close, ts: Date.now() });
    return close;
  } catch (e) {
    return null;
  }
}

// Replaced Finnhub with Stooq lightweight CSV quote endpoint.
// Stooq quote format example:
// https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv ->
// Symbol,Date,Time,Open,High,Low,Close,Volume
// AAPL.US,2025-08-26,22:00:07,219.58,221.49,218.55,220.85,36669361
async function fetchQuote(ticker, outCurrency = 'USD') {
  if (!ticker) return false;
  const upper = ticker.toUpperCase();
  let raw = SYMBOL_OVERRIDES[upper] || upper; // may already include suffix
  let symbol = raw.toLowerCase();
  if (!/\.[a-z]{2,4}$/.test(symbol)) {
    symbol += '.us';
  }
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return false;
    const dataLine = lines[1];
    if (dataLine.includes(',N/D')) return false;
    const cols = dataLine.split(',');
    if (cols.length < 8) return false;
    let close = parseFloat(cols[6]);
    if (isNaN(close)) return false;
    // Convert HK listings to USD if requested (default outCurrency USD)
    if (symbol.endsWith('.hk') && outCurrency === 'USD') {
      const fx = await fetchFxRate('usdhkd'); // HKD per USD (~7.8)
      if (fx) close = close / fx; // HKD price / (HKD per USD) = USD
    }
    return Number(close.toFixed(2));
  } catch (e) {
    return false;
  }
}

function getFromCache(ticker, ttlMs) {
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
      'Content-Type': 'application/json; charset=utf-8',
      // 4 hour caching for CDN/browser; adjust if fresher data needed
      'Cache-Control': 'public, max-age=14400, s-maxage=14400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...headers
    }
  });
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }
  const url = new URL(req.url);
  const tickerParam = url.searchParams.get('ticker');
  const tickersParam = url.searchParams.get('tickers');
  const ttlMs = parseInt(url.searchParams.get('ttlMs')) || DEFAULT_TTL_MS;
  const outCurrency = (url.searchParams.get('currency') || 'USD').toUpperCase();

  if (!tickerParam && !tickersParam) {
    return json({ error: 'Missing required query param: ticker or tickers' }, { status: 400 });
  }

  // Build list of tickers (unique, uppercase, trimmed)
  const tickers = (tickersParam ? tickersParam.split(',') : [tickerParam])
    .map(t => t.trim().toUpperCase())
    .filter(t => t);
  if (tickers.length === 0) {
    return json({ error: 'No valid tickers provided' }, { status: 400 });
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
    const fetched = await Promise.all(toFetch.map(t => fetchQuote(t, outCurrency)));
    toFetch.forEach((t, idx) => {
      const val = fetched[idx];
      setCache(t, val);
      results[t] = val;
    });
  }

  // If only single ticker requested with ?ticker= return flat shape for convenience
  if (tickerParam && !tickersParam) {
    return json({ ticker: tickers[0], price: results[tickers[0]], currency: outCurrency });
  }
  return json({ prices: results, count: Object.keys(results).length, currency: outCurrency });
};