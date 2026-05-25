import { useState, useEffect, useCallback } from 'react';
import { ZOHO_CONFIG } from '../lib/zoho/zohoConfig';

interface ZohoTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function useZohoAuth() {
  const [tokens, setTokens] = useState<ZohoTokens | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load tokens from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('zoho_tokens');
    if (stored) {
      try {
        setTokens(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('zoho_tokens');
      }
    }
    setIsInitializing(false);
  }, []);

  const saveTokens = useCallback((newTokens: ZohoTokens) => {
    setTokens(newTokens);
    localStorage.setItem('zoho_tokens', JSON.stringify(newTokens));
  }, []);

  const login = useCallback(() => {
    const authUrl = new URL(`${ZOHO_CONFIG.authDomain}/oauth/v2/auth`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', ZOHO_CONFIG.clientId);
    authUrl.searchParams.append('scope', ZOHO_CONFIG.scopes);
    authUrl.searchParams.append('redirect_uri', ZOHO_CONFIG.redirectUri);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    
    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(() => {
    setTokens(null);
    localStorage.removeItem('zoho_tokens');
  }, []);

  // Silently refresh token
  const refreshAccessToken = useCallback(async () => {
    if (!tokens?.refreshToken) return false;

    try {
      // In production, this call should go through your secure backend
      // to avoid exposing the client_secret in the browser.
      const url = new URL(`${ZOHO_CONFIG.authDomain}/oauth/v2/token`);
      url.searchParams.append('refresh_token', tokens.refreshToken);
      url.searchParams.append('client_id', ZOHO_CONFIG.clientId);
      url.searchParams.append('client_secret', ZOHO_CONFIG.clientSecret);
      url.searchParams.append('grant_type', 'refresh_token');

      const response = await fetch(url.toString(), { method: 'POST' });
      const data = await response.json();

      if (data.access_token) {
        saveTokens({
          ...tokens,
          accessToken: data.access_token,
          expiresAt: Date.now() + (data.expires_in * 1000)
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to refresh Zoho token', e);
      return false;
    }
  }, [tokens, saveTokens]);

  const getValidToken = useCallback(async () => {
    if (!tokens) return null;
    
    // If token expires in less than 5 minutes, refresh it
    if (Date.now() + 5 * 60 * 1000 > tokens.expiresAt) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) return null;
      // We need to read from localStorage since state update is async
      const updated = JSON.parse(localStorage.getItem('zoho_tokens') || '{}');
      return updated.accessToken || null;
    }
    
    return tokens.accessToken;
  }, [tokens, refreshAccessToken]);

  return {
    isAuthenticated: !!tokens && !!tokens.accessToken,
    isInitializing,
    login,
    logout,
    getValidToken,
    saveTokens
  };
}
