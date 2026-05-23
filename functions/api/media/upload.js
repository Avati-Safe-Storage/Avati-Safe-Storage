// ============================================================
//  Cloudflare Pages Function: POST /api/media/upload
//  Accepts multipart/form-data containing a file,
//  authenticates with Zoho, and streams the upload directly
//  to Zoho WorkDrive (Indian Data Center zoho.in).
// ============================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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
 * Retrieves a valid Zoho access token, refreshing it if expired.
 * Supported scope must originally include: WorkDrive.Files.ALL
 */
async function getAccessToken(env) {
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const clientId = env.ZOHO_CLIENT_ID;
  const clientSecret = env.ZOHO_CLIENT_SECRET;
  const refreshToken = env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho environment variables are not fully configured on the server (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN).');
  }

  const datacenter = env.ZOHO_DATACENTER ?? 'in';
  const tokenUrl = `https://accounts.zoho.${datacenter}/oauth/v2/token`;

  console.log('[zoho-media-upload] [API_CALL] Starting POST request to refresh Zoho Access Token...');
  const response = await fetchWithTimeout(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }).toString(),
  });
  console.log(`[zoho-media-upload] [API_CALL] Finished POST request to refresh token. Status: ${response.status}`);

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error('[zoho-media-upload] Token refresh failed response:', data);
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
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return new Response(
      JSON.stringify({ error: 'Content-Type must be multipart/form-data' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to parse form data' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid file in form data under the field name "file"' }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const folderId = env.ZOHO_WORKDRIVE_FOLDER_ID;
  if (!folderId) {
    return new Response(
      JSON.stringify({ error: 'Server environment variable ZOHO_WORKDRIVE_FOLDER_ID is not configured' }),
      { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 1. Get Zoho Access Token (includes WorkDrive.Files.ALL scope originally authorized)
    const token = await getAccessToken(env);

    // 2. Read the file as binary (ArrayBuffer)
    const fileBuffer = await file.arrayBuffer();

    // 3. Prepare headers for the stream upload request to Zoho WorkDrive
    const uploadId = `UP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const encodedFilename = encodeURIComponent(file.name);

    // Zoho WorkDrive Upload API
    const uploadUrl = 'https://upload.zoho.in/workdrive-api/v1/stream/upload';

    console.log(`[zoho-media-upload] [API_CALL] Starting POST request to stream upload to WorkDrive at: ${uploadUrl}`);
    const zohoResponse = await fetchWithTimeout(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'x-filename': encodedFilename,
        'x-parent_id': folderId,
        'upload-id': uploadId,
        'x-streammode': '1',
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/vnd.api+json'
      },
      body: fileBuffer,
    });
    console.log(`[zoho-media-upload] [API_CALL] Finished POST request to stream upload. Status: ${zohoResponse.status}`);

    const result = await zohoResponse.json();

    // 4. Verify Zoho response & extract the shareable Permalink
    if (!zohoResponse.ok || !result.data) {
      console.error('[zoho-media-upload] Zoho WorkDrive upload failed:', result);
      return new Response(
        JSON.stringify({
          error: 'Zoho WorkDrive upload failed',
          details: result,
        }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const resource = Array.isArray(result.data) ? result.data[0] : result.data;
    const permalink = resource?.attributes?.permalink;

    if (!permalink) {
      console.error('[zoho-media-upload] Permalink missing in Zoho response:', result);
      return new Response(
        JSON.stringify({
          error: 'Permalink not returned from Zoho WorkDrive',
          details: result,
        }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Return success and permalink to React frontend
    return new Response(
      JSON.stringify({ success: true, permalink, resourceId: resource.id }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[zoho-media-upload] Internal server error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || String(error),
      }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}
