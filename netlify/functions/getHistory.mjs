// Netlify Function: getHistory
// Primary source: Yahoo Finance chart API (no key, works from datacenter IPs,
// tracks recent ticker renames). Stooq is a best-effort fallback only — stooq's
// CSV download now sits behind a JS browser challenge and blocks server IPs, so
// it can no longer be relied on as the primary source.
// Request: /.netlify/functions/getHistory?ticker=AAPL
// Response: { ticker, prices: [{date, close}], source: 'yahoo' | 'stooq' }

const CACHE = new Map(); // key -> { ts, data }
const TTL = 60 * 60 * 1000; // 1 hour cache
const BASE_CACHE_TAG = process.env.CACHE_TAG || "carter-site";
const STOOQ_API_KEY = (process.env.STOOQ_API_KEY || "").trim();
const DEFAULT_TRADING_DAYS = 260; // ~1 year of daily closes when no `since` filter

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
      // Comma separated cache tags for CDN level purging (Netlify cache-tag beta)
      // Tags: site, function, ticker and optional since filter indicator
      "Cache-Tag": [
        BASE_CACHE_TAG,
        "fn:getHistory",
        body?.ticker ? `ticker:${body.ticker}` : null,
        body?.since ? "filtered" : null,
      ]
        .filter(Boolean)
        .join(","),
      ...(init.headers || {}),
    },
  });
}

/** @returns {{ prices: Array<{date:string, close:number}>, authRequired?: boolean }} */
function parseStooqDailyCsv(text, sinceParam) {
  if (text.includes("Get your apikey")) {
    return { prices: [], authRequired: true };
  }
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { prices: [] };

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  let dateIdx = header.indexOf("date");
  let closeIdx = header.indexOf("close");
  if (dateIdx < 0) dateIdx = 0;
  if (closeIdx < 0) closeIdx = 4;

  const prices = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length <= Math.max(dateIdx, closeIdx)) continue;
    const date = (cols[dateIdx] || "").trim();
    const close = parseFloat(cols[closeIdx]);
    if (sinceParam && date < sinceParam) continue;
    if (!isNaN(close)) prices.push({ date, close });
  }
  return { prices };
}

/**
 * Fetch daily closes from Yahoo Finance chart API.
 * @returns {Promise<Array<{date:string, close:number}>>}
 */
async function fetchYahooHistory(ticker, sinceParam) {
  // 2y of daily data covers both the default ~1y view and most `since` filters.
  const range = sinceParam ? "5y" : "2y";
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
    `?range=${range}&interval=1d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }, // Yahoo rejects request with no UA
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp;
  const closes = result?.indicators?.quote?.[0]?.close;
  if (!Array.isArray(timestamps) || !Array.isArray(closes)) return [];

  const prices = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (typeof close !== "number" || isNaN(close)) continue; // gaps/holidays
    const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
    if (sinceParam && date < sinceParam) continue;
    prices.push({ date, close: Number(close.toFixed(2)) });
  }
  return prices;
}

async function handler(req) {
  if (req.method === "OPTIONS") return json({ ok: true });
  const url = new URL(req.url);
  const t = (url.searchParams.get("ticker") || "").trim().toUpperCase();
  const sinceParam = (url.searchParams.get("since") || "").trim(); // earliest date (YYYY-MM-DD)
  if (!t) return json({ error: "Missing ticker" }, { status: 400 });

  const cacheKey = sinceParam ? `${t}|${sinceParam}` : t;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) {
    return json(cached.data);
  }

  let prices = [];
  let source = "yahoo";
  let error;
  let message;

  // Primary: Yahoo Finance chart API.
  try {
    prices = await fetchYahooHistory(t, sinceParam);
    if (!sinceParam) prices = prices.slice(-DEFAULT_TRADING_DAYS);
  } catch (e) {
    console.warn("[getHistory] yahoo fetch failed", t, e);
  }

  // Fallback: Stooq CSV (best-effort; usually blocked from server IPs).
  if (prices.length === 0) {
    const symbol = `${t.toLowerCase()}.us`;
    let csvUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
    if (STOOQ_API_KEY) {
      csvUrl += `&apikey=${encodeURIComponent(STOOQ_API_KEY)}`;
    }
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      const parsed = parseStooqDailyCsv(text, sinceParam);
      if (parsed.authRequired) {
        error = "stooq_auth_required";
        message =
          "Yahoo returned no data and Stooq requires an API key for CSV downloads.";
      } else if (parsed.prices.length) {
        source = "stooq";
        prices = sinceParam
          ? parsed.prices
          : parsed.prices.slice(-DEFAULT_TRADING_DAYS);
      } else {
        error = "no_data";
        message = "No historical data found for " + t + ".";
      }
    } catch (e) {
      console.warn("[getHistory] stooq fetch failed", t, e);
      error = "fetch_failed";
      message = String(e?.message || e);
    }
  }

  const payload = {
    ticker: t,
    prices,
    source,
    since: sinceParam || null,
    ...(error && { error, message }),
  };

  if (!error) {
    CACHE.set(cacheKey, { ts: Date.now(), data: payload });
  }

  return json(payload);
}

export default handler;
