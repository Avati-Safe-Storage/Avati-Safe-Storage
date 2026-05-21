// ============================================================
//  Avati Safe Storage — Zoho OAuth Client
//  Handles OAuth 2.0 token lifecycle for the Zoho India datacenter.
//
//  Architecture:
//  ┌─ Browser (this file) ──────────────────────────────────────┐
//  │  ZohoOAuthClient.getToken()                                │
//  │         │                                                  │
//  │         ▼                                                  │
//  │  POST /api/zoho-token  (Cloudflare Pages Function)        │
//  │         │                                                  │
//  │         ▼ (server-side only, secret never leaves server)  │
//  │  accounts.zoho.in/oauth/v2/token  ◄── client_secret       │
//  │         │                                                  │
//  │         ▼                                                  │
//  │  access_token  ───────────────────────────────────────────►│
//  └────────────────────────────────────────────────────────────┘
//
//  Setup required in Cloudflare Pages Function environment:
//    ZOHO_CLIENT_ID      — from api-console.zoho.in
//    ZOHO_CLIENT_SECRET  — NEVER in frontend env vars
//    ZOHO_REFRESH_TOKEN  — obtained once via browser OAuth flow
//    ZOHO_DATACENTER     — "in" for India
// ============================================================

const TOKEN_PROXY_URL = '/api/zoho-token';
const TOKEN_CACHE_KEY = 'avati_zoho_access_token';
const TOKEN_EXPIRY_KEY = 'avati_zoho_token_expiry';

// ── Token storage (in-memory, session-only) ──────────────────
// We never persist the access_token in localStorage. It lives only in memory.
let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

// ── ZohoOAuthClient ──────────────────────────────────────────
export class ZohoOAuthClient {
  private static instance: ZohoOAuthClient;

  static getInstance(): ZohoOAuthClient {
    if (!ZohoOAuthClient.instance) {
      ZohoOAuthClient.instance = new ZohoOAuthClient();
    }
    return ZohoOAuthClient.instance;
  }

  /** Returns a valid access token, refreshing via the proxy if needed */
  async getToken(): Promise<string | null> {
    // Return cached token if still valid (with 60s buffer)
    if (_cachedToken && Date.now() < _tokenExpiry - 60_000) {
      return _cachedToken;
    }

    try {
      const response = await fetch(TOKEN_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });

      if (!response.ok) {
        console.error('[ZohoAuth] Token refresh failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.access_token) {
        console.error('[ZohoAuth] No access_token in response');
        return null;
      }

      // Cache in memory only
      _cachedToken = data.access_token;
      // Zoho tokens expire in 3600s. We cache for 55 minutes.
      _tokenExpiry = Date.now() + (data.expires_in ?? 3300) * 1000;

      return _cachedToken;
    } catch (err) {
      console.error('[ZohoAuth] Token fetch error:', err);
      return null;
    }
  }

  /** True if a valid token exists in memory */
  isAuthenticated(): boolean {
    return !!_cachedToken && Date.now() < _tokenExpiry - 60_000;
  }

  /** Clear cached token (e.g., on logout) */
  clearToken(): void {
    _cachedToken = null;
    _tokenExpiry = 0;
  }
}

// Singleton export
export const zohoAuth = ZohoOAuthClient.getInstance();

// ── Authenticated Zoho API helper ────────────────────────────
const ZOHO_CRM_BASE    = 'https://www.zohoapis.in/crm/v6';
const ZOHO_BOOKS_BASE  = 'https://www.zohoapis.in/books/v3';
const ZOHO_CREATOR_BASE = 'https://creator.zoho.in/api/v2';

export async function zohoApiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await zohoAuth.getToken();
  const headers = new Headers(options.headers ?? {});

  if (token) {
    headers.set('Authorization', `Zoho-oauthtoken ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  return fetch(url, { ...options, headers });
}

export { ZOHO_CRM_BASE, ZOHO_BOOKS_BASE, ZOHO_CREATOR_BASE };
