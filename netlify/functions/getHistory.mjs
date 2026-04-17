// Netlify Function: getHistory
// Proxies Stooq daily CSV (requires STOOQ_API_KEY — see https://stooq.com/db/h/).
// Request: /.netlify/functions/getHistory?ticker=AAPL
// Response: { ticker, prices: [{date, close}], source: 'stooq' }

const CACHE = new Map(); // key -> { ts, data }
const TTL = 60 * 60 * 1000; // 1 hour cache
const BASE_CACHE_TAG = process.env.CACHE_TAG || "carter-site";
const STOOQ_API_KEY = (process.env.STOOQ_API_KEY || "").trim();

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

async function handler(req) {
  if (req.method === "OPTIONS") return json({ ok: true });
  const url = new URL(req.url);
  const t = (url.searchParams.get("ticker") || "").trim().toUpperCase();
  const sinceParam = (url.searchParams.get("since") || "").trim(); // earliest date (YYYY-MM-DD)
  if (!t) return json({ error: "Missing ticker" }, { status: 400 });

  const cached = CACHE.get(t);
  if (cached && Date.now() - cached.ts < TTL) {
    return json(cached.data);
  }

  const symbol = `${t.toLowerCase()}.us`;
  let csvUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
  if (STOOQ_API_KEY) {
    csvUrl += `&apikey=${encodeURIComponent(STOOQ_API_KEY)}`;
  }

  let prices = [];
  const attempted = STOOQ_API_KEY
    ? csvUrl.replace(STOOQ_API_KEY, "***")
    : csvUrl;
  let error;
  let message;

  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const parsed = parseStooqDailyCsv(text, sinceParam);
    if (parsed.authRequired) {
      error = "stooq_auth_required";
      message = STOOQ_API_KEY
        ? "Stooq rejected this API key. Regenerate it at https://stooq.com/q/d/?s=" +
          encodeURIComponent(symbol) +
          "&get_apikey"
        : "Stooq requires an API key for CSV downloads. Set STOOQ_API_KEY in Netlify environment variables (see https://stooq.com/q/d/?s=" +
          encodeURIComponent(symbol) +
          "&get_apikey).";
    } else {
      prices = parsed.prices;
      if (!sinceParam) {
        prices = prices.slice(-260);
      }
    }
  } catch (e) {
    console.warn("[getHistory] fetch failed", t, e);
    error = "fetch_failed";
    message = String(e?.message || e);
  }

  const payload = {
    ticker: t,
    prices,
    source: "stooq",
    attempted,
    since: sinceParam || null,
    ...(error && { error, message }),
  };

  if (!error) {
    CACHE.set(t, { ts: Date.now(), data: payload });
  }

  return json(payload);
}

export default handler;
