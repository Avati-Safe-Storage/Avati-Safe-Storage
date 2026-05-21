// ============================================================
//  Cloudflare Pages Function: /api/zoho-proxy
//  Proxies authenticated Zoho API requests from the browser.
//  The frontend passes the target Zoho API path; this function
//  fetches a fresh token and forwards the request.
//
//  Usage from browser:
//    GET  /api/zoho-proxy?target=crm/v6/Leads&...
//    POST /api/zoho-proxy  { target: "crm/v6/Leads", body: {...} }
//
//  Supported Zoho services:
//    crm/v6/*         → www.zohoapis.in/crm/v6/...
//    creator/v2.1/*   → creator.zoho.in/api/v2.1/...
//    books/v3/*       → www.zohoapis.in/books/v3/...
// ============================================================

interface Env {
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_DATACENTER?: string;
  ZOHO_BOOKS_ORG_ID?: string;
  AVATI_KV?: KVNamespace;
}

// ── Token cache (Cloudflare Worker-scoped memory) ─────────────
let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

async function getAccessToken(env: Env): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry - 60_000) {
    return _cachedToken;
  }

  const datacenter = env.ZOHO_DATACENTER ?? 'in';
  const res = await fetch(`https://accounts.zoho.${datacenter}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    }).toString(),
  });

  const data = await res.json() as Record<string, unknown>;
  if (!res.ok || !data.access_token) throw new Error('Token refresh failed');

  _cachedToken = data.access_token as string;
  _tokenExpiry = Date.now() + (Number(data.expires_in) || 3300) * 1000;
  return _cachedToken;
}

// ── Target URL resolver ───────────────────────────────────────
function resolveTargetUrl(target: string, datacenter: string, booksOrgId?: string): string {
  if (target.startsWith('creator/')) {
    return `https://creator.zoho.${datacenter}/api/${target.replace('creator/', '')}`;
  }
  if (target.startsWith('books/')) {
    const suffix = target.replace('books/', '');
    const orgParam = booksOrgId ? `&organization_id=${booksOrgId}` : '';
    return `https://www.zohoapis.${datacenter}/${suffix}${orgParam}`;
  }
  // Default: CRM
  return `https://www.zohoapis.${datacenter}/${target}`;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const target = url.searchParams.get('target');
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing target parameter' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }

  // Pass through any extra query params to Zoho
  const extraParams = new URLSearchParams();
  url.searchParams.forEach((v, k) => { if (k !== 'target') extraParams.set(k, v); });

  try {
    const token = await getAccessToken(env);
    const datacenter = env.ZOHO_DATACENTER ?? 'in';
    const zohoUrl = resolveTargetUrl(target, datacenter, env.ZOHO_BOOKS_ORG_ID);
    const finalUrl = extraParams.toString() ? `${zohoUrl}?${extraParams}` : zohoUrl;

    const zohoRes = await fetch(finalUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await zohoRes.text();
    return new Response(data, {
      status: zohoRes.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': zohoRes.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown> = {};
  try { body = await request.json() as Record<string, unknown>; } catch {}

  const target = body.target as string;
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing target in body' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }

  try {
    const token = await getAccessToken(env);
    const datacenter = env.ZOHO_DATACENTER ?? 'in';
    const zohoUrl = resolveTargetUrl(target, datacenter, env.ZOHO_BOOKS_ORG_ID);

    const zohoRes = await fetch(zohoUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body.data ?? {}),
    });

    const data = await zohoRes.text();
    return new Response(data, {
      status: zohoRes.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
