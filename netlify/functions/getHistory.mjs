// Netlify Function: getHistory
// Proxies a public CSV (Stooq) to bypass browser CORS and returns ~1y daily closes.
// Request: /.netlify/functions/getHistory?ticker=AAPL
// Response: { ticker, prices: [{date, close}], source: 'stooq' }

const CACHE = new Map(); // key -> { ts, data }
const TTL = 60 * 60 * 1000; // 1 hour cache
const BASE_CACHE_TAG = process.env.CACHE_TAG || "carter-site";

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

async function handler(req, ctx) {
  if (req.method === "OPTIONS") return json({ ok: true });
  const url = new URL(req.url);
  const t = (url.searchParams.get("ticker") || "").trim().toUpperCase();
  const sinceParam = (url.searchParams.get("since") || "").trim(); // earliest date (YYYY-MM-DD)
  if (!t) return json({ error: "Missing ticker" }, { status: 400 });

  const cached = CACHE.get(t);
  if (cached && Date.now() - cached.ts < TTL) {
    return json(cached.data);
  }

  // Stooq symbol pattern
  const symbol = `${t.toLowerCase()}.us`;
  const csvUrl = `https://stooq.com/q/d/l/?s=${symbol}&i=d`;
  let prices = [];
  let attempted = csvUrl;
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/).slice(1); // skip header
    for (const line of lines) {
      const cols = line.split(",");
      if (cols.length < 5) continue;
      const date = cols[0];
      if (sinceParam && date < sinceParam) continue; // skip before earliest lot
      const close = parseFloat(cols[4]);
      if (!isNaN(close)) prices.push({ date, close });
    }
    // If no sinceParam provided, still cap to last ~1y for performance
    if (!sinceParam) {
      prices = prices.slice(-260);
    }
  } catch (e) {
    console.warn("[getHistory] fetch failed", t, e);
  }
  const payload = {
    ticker: t,
    prices,
    source: "stooq",
    attempted,
    since: sinceParam || null,
  };
  CACHE.set(t, { ts: Date.now(), data: payload });
  return json(payload);
}

export default handler;
