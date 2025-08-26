// Netlify Function: purgeCacheTag
// Purpose: Purge CDN cache entries associated with a specific cache tag header.
// Usage: POST /.netlify/functions/purgeCacheTag  { tag: "carter-site" }
// Requires environment variables:
//   NETLIFY_SITE_ID (site id)
//   NETLIFY_AUTH_TOKEN (personal access token with 'Site' scope)
// Returns: { ok: true, tag, requestId } or error

function json(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      ...headers,
    },
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });
  if (req.method !== 'POST') return json({ error: 'POST required' }, { status: 405 });
  const siteId = process.env.SITE_NAME;
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!siteId || !token) {
    return json(
      { error: 'Missing SITE_NAME or NETLIFY_AUTH_TOKEN env vars' },
      { status: 500 }
    );
  }
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const tag = (body.tag || '').trim();
  if (!tag) return json({ error: 'tag required' }, { status: 400 });

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cache_tags: [tag],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return json({ error: 'Netlify API error', status: res.status, body: txt }, { status: 502 });
    }
    const result = await res.json();
    return json({ ok: true, tag, requestId: result?.request_id || null });
  } catch (e) {
    return json({ error: 'Request failed', detail: e.message }, { status: 500 });
  }
}
