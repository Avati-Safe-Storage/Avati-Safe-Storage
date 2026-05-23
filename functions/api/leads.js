// ============================================================
//  Cloudflare Pages Function: POST /api/leads
//  Authenticates with Zoho CRM (v3, Indian Data Center zoho.in)
//  and maps request payload to create a new Lead in CRM.
// ============================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const QUOTE_METHOD_LABELS = {
  inventory: 'Live Quotation',
  upload: 'Upload 360 Video',
  visit: 'Book Survey',
};

// Worker-scoped in-memory cache for the access token
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Helper to execute a fetch request with an 8-second timeout.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request to Zoho timed out after ${timeoutMs / 1000} seconds. Please try again.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retrieves a valid Zoho CRM access token, refreshing it if expired.
 * Uses the Indian accounts server (accounts.zoho.in) for the zoho.in datacenter.
 */
async function getAccessToken(env) {
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  console.log('[zoho-leads] env object type:', typeof env);
  console.log('[zoho-leads] env object keys:', Object.keys(env || {}));
  console.log('[zoho-leads] ZOHO_CLIENT_ID length:', env.ZOHO_CLIENT_ID ? env.ZOHO_CLIENT_ID.length : 'undefined');
  console.log('[zoho-leads] ZOHO_CLIENT_SECRET length:', env.ZOHO_CLIENT_SECRET ? env.ZOHO_CLIENT_SECRET.length : 'undefined');
  console.log('[zoho-leads] ZOHO_REFRESH_TOKEN length:', env.ZOHO_REFRESH_TOKEN ? env.ZOHO_REFRESH_TOKEN.length : 'undefined');

  const clientId = env.ZOHO_CLIENT_ID;
  const clientSecret = env.ZOHO_CLIENT_SECRET;
  const refreshToken = env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho CRM environment variables are not configured on the server (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN).');
  }

  const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  console.log('[zoho-leads] [API_CALL] Starting POST request to refresh Zoho Access Token...');
  const response = await fetchWithTimeout(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  console.log(`[zoho-leads] [API_CALL] Finished POST request to refresh token. Status: ${response.status}`);

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error('[zoho-leads] Token refresh failed response:', data);
    throw new Error(`Token refresh failed: ${data.error || 'unknown error'}`);
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (Number(data.expires_in) || 3300) * 1000;
  return cachedToken;
}

// OPTIONS preflight handler
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// POST request handler
export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON request body' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const { fullName, phone, email, quoteMethod } = body;

  // Validate incoming fields
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid mandatory field: fullName' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const cleanName = fullName.trim();
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const quoteMethodLabel = QUOTE_METHOD_LABELS[quoteMethod] || quoteMethod || 'Live Quotation';

  try {
    // 1. Get Zoho Access Token
    const token = await getAccessToken(env);

    // 2. Build Zoho CRM v3 Payload
    // Map fullName to Last_Name (mandatory in Zoho CRM)
    // Set Company to 'Avati Safe Storage' (mandatory in Zoho CRM Leads)
    // Set Lead_Status to 'Contact Only'
    const zohoPayload = {
      data: [
        {
          Company: 'Avati Safe Storage',
          Last_Name: cleanName,
          Phone: cleanPhone,
          Email: cleanEmail,
          Lead_Status: 'Contact Only',
          Lead_Source: 'Website Quote',
          LEADCF6: quoteMethodLabel, // Map quoteMethod to established custom field
          Description: `Quote Method: ${quoteMethodLabel}`,
        }
      ]
    };

    // 3. Send POST request to Zoho CRM API v3 (Indian datacenter zoho.in)
    const crmUrl = 'https://www.zohoapis.in/crm/v3/Leads';
    console.log(`[zoho-leads] [API_CALL] Starting POST request to create Lead in Zoho CRM at: ${crmUrl}`);
    const crmResponse = await fetchWithTimeout(crmUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zohoPayload),
    });
    console.log(`[zoho-leads] [API_CALL] Finished POST request to create Lead. Status: ${crmResponse.status}`);

    const result = await crmResponse.json();

    // 4. Verify Zoho CRM Response & Extract Lead ID
    if (!crmResponse.ok || !result.data || !result.data[0] || result.data[0].status !== 'success') {
      console.error('[zoho-leads] Zoho CRM Lead Creation rejected:', result);
      const errDetail = (result && result.data && result.data[0]) ? result.data[0] : result;
      return new Response(
        JSON.stringify({
          error: 'Zoho CRM Lead creation failed',
          details: errDetail,
        }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const leadId = result.data[0].details.id;

    // 5. Return success and Lead ID
    return new Response(
      JSON.stringify({ success: true, leadId }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[zoho-leads] Internal server error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || String(error),
      }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}
