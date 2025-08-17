// Simple in-memory cache: ticker -> { value: number|false, ts: number }
const _stockCache = new Map();
// Track in-flight fetch promises per ticker to dedupe concurrent requests
const _inflight = new Map();

/**
 * Clear the in-memory stock cache (intended for tests)
 */
export function __clearStockCache() {
  _stockCache.clear();
  _inflight.clear();
}

/**
 * Fetch (and memoize) latest quote current price for a ticker.
 * Backwards compatible: getStockData(ticker) => number|false
 * New options:
 *  - ttlMs (default 60000): cache time-to-live in ms
 *  - force (default false): bypass cache and refresh
 */
export async function getStockData(ticker, options = {}) {
  const {
    ttlMs = 60000, // positive cache TTL (reverted to original 60s default)
    force = false,
    negativeTtlMs = ttlMs, // TTL for negative (false) cache entries
  } = options || {};
  if (!ticker) return false;
  const now = Date.now();
  const cached = _stockCache.get(ticker);
  if (!force && cached) {
    const age = now - cached.ts;
    const effectiveTtl = cached.value === false ? negativeTtlMs : ttlMs;
    if (age < effectiveTtl) {
      return cached.value;
    }
  }
  if (!force) {
    const inFlight = _inflight.get(ticker);
    if (inFlight) return inFlight; // return same promise to callers
  }
  // const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`;
  const url = `https://stocks.joshuarogan.com/.netlify/functions/getStocks?ticker=${ticker}`;
  const fetchPromise = (async () => {
    let value = false;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const current =
          typeof data?.price === "number"
            ? data.price
            : parseFloat(data?.price);
        value = isNaN(current) ? false : current;
      } else {
        // Non-OK (e.g., 4xx) -> negative cache to avoid tight retry loops
        value = false;
      }
    } catch (e) {
      // Network/other error: if we had a previous cached non-false value still valid, reuse it without updating timestamp
      if (cached && cached.value !== false) {
        return cached.value;
      }
      value = false; // negative cache (initial failure)
    }
    _stockCache.set(ticker, { value, ts: Date.now() });
    return value;
  })();
  _inflight.set(ticker, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    _inflight.delete(ticker);
  }
}
