// ============================================================
//  Cloudflare Pages Function: /api/zoho-token
//  Handles Zoho OAuth 2.0 token refresh server-side.
//  The ZOHO_CLIENT_SECRET never reaches the browser.
//
//  Required Cloudflare Pages environment variables (set in dashboard):
//    ZOHO_CLIENT_ID      — from api-console.zoho.in
//    ZOHO_CLIENT_SECRET  — from api-console.zoho.in
//    ZOHO_REFRESH_TOKEN  — one-time browser OAuth flow
//    ZOHO_DATACENTER     — "in" (India) | "com" | "eu" | "com.au"
//
//  Deploy: This file lives at functions/api/zoho-token.ts
//  Cloudflare Pages auto-routes it to /api/zoho-token
// ============================================================

interface Env {
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_DATACENTER?: string;
  // Cloudflare KV for OTP storage
  AVATI_KV?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://www.avatisafestorage.com',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Validate origin for CSRF protection
  const origin = request.headers.get('Origin') ?? '';
  const allowedOrigins = [
    'https://www.avatisafestorage.com',
    'https://avatisafestorage.com',
    // Also allow admin subdomain
    'https://admin.avatisafestorage.com',
    // Allow localhost for development
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  if (!allowedOrigins.some(o => origin.startsWith(o))) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
  }

  if (!env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET || !env.ZOHO_REFRESH_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Zoho OAuth not configured on server' }),
      { status: 503, headers: corsHeaders },
    );
  }

  const datacenter = env.ZOHO_DATACENTER ?? 'in';
  const tokenUrl = `https://accounts.zoho.${datacenter}/oauth/v2/token`;

  try {
    const body = new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    });

    const zohoResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await zohoResponse.json() as Record<string, unknown>;

    if (!zohoResponse.ok || data.error) {
      console.error('[zoho-token] Zoho returned error:', data);
      return new Response(
        JSON.stringify({ error: 'Token refresh failed', detail: data.error }),
        { status: 502, headers: corsHeaders },
      );
    }

    // Return access_token and expires_in — never expose client_secret
    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        expires_in:   data.expires_in ?? 3600,
        api_domain:   data.api_domain,
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error('[zoho-token] Fetch error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders },
    );
  }
};

// Handle OPTIONS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
