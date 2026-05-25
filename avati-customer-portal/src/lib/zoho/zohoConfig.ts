export const ZOHO_CONFIG = {
  clientId: import.meta.env.VITE_ZOHO_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_ZOHO_REDIRECT_URI || 'http://localhost:5173/auth/zoho/callback',
  authDomain: import.meta.env.VITE_ZOHO_AUTH_DOMAIN || 'https://accounts.zoho.in',
  apiDomain: import.meta.env.VITE_ZOHO_API_DOMAIN || 'https://www.zohoapis.in',
  flowWebhookUrl: import.meta.env.VITE_ZOHO_FLOW_WEBHOOK_URL || '',
  
  // Scopes required for the integration
  scopes: [
    'ZohoCRM.modules.ALL',
    'ZohoCRM.settings.ALL',
    'ZohoInventory.FullAccess.all',
    'ZohoBooks.fullaccess.all',
    'ZohoSign.documents.ALL'
  ].join(',')
};
