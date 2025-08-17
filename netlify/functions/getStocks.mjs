// Netlify Function: getStocks
// Usage examples:
//  Single: /.netlify/functions/getStocks?ticker=AAPL
//  Multiple: /.netlify/functions/getStocks?tickers=AAPL,MSFT,GOOG
// Returns JSON with prices (number) or false when unavailable.
// Caches results in-memory (per lambda instance) for a short TTL to reduce Finnhub calls.

const DEFAULT_TTL_MS = 60_000; // 1 minute
const CACHE = new Map(); // ticker -> { value:number|false, ts:number }

const API_KEY = process.env.FINNHUB_API_KEY || "buc51vv48v6oa2u4gkpg"; // fallback to hardcoded if env not set

async function fetchQuote(ticker) {
  if (!ticker) return false;
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    const current = typeof data?.c === 'number' ? data.c : parseFloat(data?.c);
    return isNaN(current) ? false : current;
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
      'Cache-Control': 'public, max-age=14400, s-maxage=14400, immutable',
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
    const fetched = await Promise.all(toFetch.map(fetchQuote));
    toFetch.forEach((t, idx) => {
      const val = fetched[idx];
      setCache(t, val);
      results[t] = val;
    });
  }

  // If only single ticker requested with ?ticker= return flat shape for convenience
  if (tickerParam && !tickersParam) {
    return json({ ticker: tickers[0], price: results[tickers[0]] });
  }
  return json({ prices: results, count: Object.keys(results).length });
};