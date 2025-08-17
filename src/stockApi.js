const API_KEY = "buc51vv48v6oa2u4gkpg";

// Simple in-memory cache: ticker -> { value: number|false, ts: number }
const _stockCache = new Map();

/**
 * Clear the in-memory stock cache (intended for tests)
 */
export function __clearStockCache() {
  _stockCache.clear();
}

/**
 * Fetch (and memoize) latest quote current price for a ticker.
 * Backwards compatible: getStockData(ticker) => number|false
 * New options:
 *  - ttlMs (default 60000): cache time-to-live in ms
 *  - force (default false): bypass cache and refresh
 */
export async function getStockData(ticker, options = {}) {
  const { ttlMs = 60000, force = false } = options || {};
  if (!ticker) return false;
  const now = Date.now();
  const cached = _stockCache.get(ticker);
  if (!force && cached && now - cached.ts < ttlMs) {
    return cached.value;
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // preserve previous cached value if present
      if (cached) return cached.value;
      return false;
    }
    const data = await res.json();
    const current = typeof data?.c === "number" ? data.c : parseFloat(data?.c);
    const value = isNaN(current) ? false : current;
    _stockCache.set(ticker, { value, ts: now });
    return value;
  } catch (e) {
    if (cached) return cached.value;
    return false;
  }
}
