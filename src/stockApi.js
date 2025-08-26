// Simple in-memory cache: ticker -> { value: number|false, ts: number }
const _stockCache = new Map();
// Track in-flight fetch promises per ticker to dedupe concurrent requests
const _inflight = new Map();

// Netlify function is reachable via relative path both locally (netlify dev) and in production.
// So we intentionally do NOT prefix with any host/origin.

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
  // NOTE: Removing unconditional cache clear to preserve caching across calls.
  // __clearStockCache(); // (Was previously clearing every call, defeating cache.)
  const {
    ttlMs = 60000, // positive cache TTL (60s default)
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

  const url =
    "/.netlify/functions/getStocks?ticker=" + encodeURIComponent(ticker);

  const fetchPromise = (async () => {
    let value = false;
    try {
      const controller = new AbortController();
      const timeoutMs = 4000; // general timeout
      const to = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(to);
      if (res.ok) {
        const data = await res.json();
        const current =
          typeof data?.price === "number"
            ? data.price
            : parseFloat(data?.price);
        value = isNaN(current) ? false : current;
      }
    } catch (e) {
      // swallow, value stays false
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
