// Fetch 1-year (approx) daily closing prices for a ticker using Stooq public CSV endpoint.
// No API key required. We add a simple in-memory cache to avoid repeat fetches.
// Returns Promise<{ prices: Array<{ date: string, close: number }>, source: string }>
// If fetch fails, resolves to { prices: [], source: 'stooq' }.

const _historyCache = new Map(); // ticker -> { ts, data }

const ONE_HOUR = 60 * 60 * 1000;

export async function fetchYearHistory(ticker, { force = false, since } = {}) {
  if (!ticker) return { prices: [], source: "stooq" };
  const key = ticker.toUpperCase();
  const cacheKey = since ? `${key}|${since}` : key;
  const cached = _historyCache.get(cacheKey);
  const now = Date.now();
  if (!force && cached && now - cached.ts < ONE_HOUR) {
    return cached.data;
  }
  try {
    const qs = new URLSearchParams({ ticker: key });
    if (since) qs.set("since", since);
    const res = await fetch(`/.netlify/functions/getHistory?${qs.toString()}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const result = {
      prices: Array.isArray(data?.prices) ? data.prices : [],
      source: data?.source || "stooq",
      attempted: data?.attempted,
      since: data?.since || since || null,
    };
    _historyCache.set(cacheKey, { ts: now, data: result });
    return result;
  } catch (e) {
    console.warn("[history] failed for", ticker, e);
    const result = { prices: [], source: "stooq", error: true };
    _historyCache.set(cacheKey, { ts: now, data: result });
    return result;
  }
}

export function __clearHistoryCache() {
  _historyCache.clear();
}
