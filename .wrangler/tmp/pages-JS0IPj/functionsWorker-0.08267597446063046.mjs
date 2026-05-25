var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/media/upload.js
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var cachedToken = null;
var tokenExpiry = 0;
async function fetchWithTimeout(url, options = {}, timeoutMs = 8e3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Request to Zoho timed out after ${timeoutMs / 1e3} seconds. Please try again.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
__name(fetchWithTimeout, "fetchWithTimeout");
async function getAccessToken(env) {
  if (cachedToken && Date.now() < tokenExpiry - 6e4) {
    return cachedToken;
  }
  const clientId = env.ZOHO_CLIENT_ID;
  const clientSecret = env.ZOHO_CLIENT_SECRET;
  const refreshToken = env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho environment variables are not fully configured on the server (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN).");
  }
  const datacenter = env.ZOHO_DATACENTER ?? "in";
  const tokenUrl = `https://accounts.zoho.${datacenter}/oauth/v2/token`;
  console.log("[zoho-media-upload] [API_CALL] Starting POST request to refresh Zoho Access Token...");
  const response = await fetchWithTimeout(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    }).toString()
  });
  console.log(`[zoho-media-upload] [API_CALL] Finished POST request to refresh token. Status: ${response.status}`);
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error("[zoho-media-upload] Token refresh failed response:", data);
    throw new Error(`Token refresh failed: ${data.error || "unknown error"}`);
  }
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (Number(data.expires_in) || 3300) * 1e3;
  return cachedToken;
}
__name(getAccessToken, "getAccessToken");
async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
__name(onRequestOptions, "onRequestOptions");
async function onRequestPost({ request, env }) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to parse form data" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid file in form data under the field name "file"' }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
  const folderId = env.ZOHO_WORKDRIVE_FOLDER_ID;
  if (!folderId) {
    return new Response(
      JSON.stringify({ error: "Server environment variable ZOHO_WORKDRIVE_FOLDER_ID is not configured" }),
      { status: 503, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
  try {
    const token = await getAccessToken(env);
    const fileBuffer = await file.arrayBuffer();
    const uploadId = `UP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const encodedFilename = encodeURIComponent(file.name);
    const uploadUrl = "https://upload.zoho.in/workdrive-api/v1/stream/upload";
    console.log(`[zoho-media-upload] [API_CALL] Starting POST request to stream upload to WorkDrive at: ${uploadUrl}`);
    const zohoResponse = await fetchWithTimeout(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "x-filename": encodedFilename,
        "x-parent_id": folderId,
        "upload-id": uploadId,
        "x-streammode": "1",
        "Content-Type": "application/octet-stream",
        "Accept": "application/vnd.api+json"
      },
      body: fileBuffer
    });
    console.log(`[zoho-media-upload] [API_CALL] Finished POST request to stream upload. Status: ${zohoResponse.status}`);
    const result = await zohoResponse.json();
    if (!zohoResponse.ok || !result.data) {
      console.error("[zoho-media-upload] Zoho WorkDrive upload failed:", result);
      return new Response(
        JSON.stringify({
          error: "Zoho WorkDrive upload failed",
          details: result
        }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
    const resource = Array.isArray(result.data) ? result.data[0] : result.data;
    const permalink = resource?.attributes?.permalink;
    if (!permalink) {
      console.error("[zoho-media-upload] Permalink missing in Zoho response:", result);
      return new Response(
        JSON.stringify({
          error: "Permalink not returned from Zoho WorkDrive",
          details: result
        }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, permalink, resourceId: resource.id }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[zoho-media-upload] Internal server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message || String(error)
      }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
}
__name(onRequestPost, "onRequestPost");

// api/leads.js
var CORS_HEADERS2 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var QUOTE_METHOD_LABELS = {
  inventory: "Live Quotation",
  upload: "Upload 360 Video",
  visit: "Book Survey"
};
var cachedToken2 = null;
var tokenExpiry2 = 0;
async function fetchWithTimeout2(url, options = {}, timeoutMs = 8e3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Request to Zoho timed out after ${timeoutMs / 1e3} seconds. Please try again.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
__name(fetchWithTimeout2, "fetchWithTimeout");
async function getAccessToken2(env) {
  if (cachedToken2 && Date.now() < tokenExpiry2 - 6e4) {
    return cachedToken2;
  }
  console.log("[zoho-leads] env object type:", typeof env);
  console.log("[zoho-leads] env object keys:", Object.keys(env || {}));
  console.log("[zoho-leads] ZOHO_CLIENT_ID length:", env.ZOHO_CLIENT_ID ? env.ZOHO_CLIENT_ID.length : "undefined");
  console.log("[zoho-leads] ZOHO_CLIENT_SECRET length:", env.ZOHO_CLIENT_SECRET ? env.ZOHO_CLIENT_SECRET.length : "undefined");
  console.log("[zoho-leads] ZOHO_REFRESH_TOKEN length:", env.ZOHO_REFRESH_TOKEN ? env.ZOHO_REFRESH_TOKEN.length : "undefined");
  const clientId = env.ZOHO_CLIENT_ID;
  const clientSecret = env.ZOHO_CLIENT_SECRET;
  const refreshToken = env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho CRM environment variables are not configured on the server (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN).");
  }
  const tokenUrl = "https://accounts.zoho.in/oauth/v2/token";
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  });
  console.log("[zoho-leads] [API_CALL] Starting POST request to refresh Zoho Access Token...");
  const response = await fetchWithTimeout2(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  console.log(`[zoho-leads] [API_CALL] Finished POST request to refresh token. Status: ${response.status}`);
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error("[zoho-leads] Token refresh failed response:", data);
    throw new Error(`Token refresh failed: ${data.error || "unknown error"}`);
  }
  cachedToken2 = data.access_token;
  tokenExpiry2 = Date.now() + (Number(data.expires_in) || 3300) * 1e3;
  return cachedToken2;
}
__name(getAccessToken2, "getAccessToken");
async function onRequestOptions2() {
  return new Response(null, { status: 204, headers: CORS_HEADERS2 });
}
__name(onRequestOptions2, "onRequestOptions");
async function onRequestPost2({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON request body" }),
      { status: 400, headers: { ...CORS_HEADERS2, "Content-Type": "application/json" } }
    );
  }
  const { fullName, phone, email, quoteMethod } = body;
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid mandatory field: fullName" }),
      { status: 400, headers: { ...CORS_HEADERS2, "Content-Type": "application/json" } }
    );
  }
  const cleanName = fullName.trim();
  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const quoteMethodLabel = QUOTE_METHOD_LABELS[quoteMethod] || quoteMethod || "Live Quotation";
  try {
    const token = await getAccessToken2(env);
    const zohoPayload = {
      data: [
        {
          Company: "Avati Safe Storage",
          Last_Name: cleanName,
          Phone: cleanPhone,
          Email: cleanEmail,
          Lead_Status: "Contact Only",
          Lead_Source: "Website Quote",
          LEADCF6: quoteMethodLabel,
          // Map quoteMethod to established custom field
          Description: `Quote Method: ${quoteMethodLabel}`
        }
      ]
    };
    const crmUrl = "https://www.zohoapis.in/crm/v3/Leads";
    console.log(`[zoho-leads] [API_CALL] Starting POST request to create Lead in Zoho CRM at: ${crmUrl}`);
    const crmResponse = await fetchWithTimeout2(crmUrl, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(zohoPayload)
    });
    console.log(`[zoho-leads] [API_CALL] Finished POST request to create Lead. Status: ${crmResponse.status}`);
    const result = await crmResponse.json();
    if (!crmResponse.ok || !result.data || !result.data[0] || result.data[0].status !== "success") {
      console.error("[zoho-leads] Zoho CRM Lead Creation rejected:", result);
      const errDetail = result && result.data && result.data[0] ? result.data[0] : result;
      return new Response(
        JSON.stringify({
          error: "Zoho CRM Lead creation failed",
          details: errDetail
        }),
        { status: 502, headers: { ...CORS_HEADERS2, "Content-Type": "application/json" } }
      );
    }
    const leadId = result.data[0].details.id;
    return new Response(
      JSON.stringify({ success: true, leadId }),
      { status: 200, headers: { ...CORS_HEADERS2, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[zoho-leads] Internal server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message || String(error)
      }),
      { status: 500, headers: { ...CORS_HEADERS2, "Content-Type": "application/json" } }
    );
  }
}
__name(onRequestPost2, "onRequestPost");

// api/otp-send.ts
var OTP_TTL_SECONDS = 600;
var OTP_RATE_LIMIT_SECONDS = 60;
function generateOTP() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}
__name(generateOTP, "generateOTP");
var CORS_HEADERS3 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};
var onRequestPost3 = /* @__PURE__ */ __name(async ({ request, env }) => {
  if (!env.AVATI_KV) {
    return new Response(JSON.stringify({ error: "KV not configured" }), { status: 503, headers: CORS_HEADERS3 });
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: CORS_HEADERS3 });
  }
  const { phone, channel = "sms", email, purpose = "login" } = body;
  const normalised = (phone ?? "").replace(/\D/g, "").slice(-10);
  if (normalised.length !== 10) {
    return new Response(JSON.stringify({ error: "Invalid phone number" }), { status: 400, headers: CORS_HEADERS3 });
  }
  const rateLimitKey = `otp:ratelimit:${normalised}`;
  const existing = await env.AVATI_KV.get(rateLimitKey);
  if (existing) {
    return new Response(
      JSON.stringify({ error: "Please wait 60 seconds before requesting another OTP" }),
      { status: 429, headers: CORS_HEADERS3 }
    );
  }
  const otp = generateOTP();
  const otpKey = `otp:${normalised}`;
  const expiry = new Date(Date.now() + OTP_TTL_SECONDS * 1e3).toISOString();
  await env.AVATI_KV.put(otpKey, JSON.stringify({ otp, expiry, attempts: 0 }), {
    expirationTtl: OTP_TTL_SECONDS
  });
  await env.AVATI_KV.put(rateLimitKey, "1", { expirationTtl: OTP_RATE_LIMIT_SECONDS });
  if (env.FLOW_OTP_WEBHOOK) {
    const webhookPayload = {
      phone: `+91${normalised}`,
      otp,
      otpExpiry: expiry,
      channel,
      email: email ?? "",
      purpose,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    fetch(env.FLOW_OTP_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload)
    }).catch((err) => console.error("[otp-send] Flow webhook error:", err));
  } else {
    console.warn("[otp-send] FLOW_OTP_WEBHOOK not configured \u2014 OTP not delivered");
  }
  return new Response(
    JSON.stringify({ success: true, expiresIn: OTP_TTL_SECONDS }),
    { status: 200, headers: CORS_HEADERS3 }
  );
}, "onRequestPost");
var onRequestOptions3 = /* @__PURE__ */ __name(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS3 });
}, "onRequestOptions");

// api/otp-verify.ts
var MAX_ATTEMPTS = 3;
var CORS_HEADERS4 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};
async function getToken(env) {
  try {
    const dc = env.ZOHO_DATACENTER ?? "in";
    const res = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        refresh_token: env.ZOHO_REFRESH_TOKEN
      }).toString()
    });
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}
__name(getToken, "getToken");
async function lookupCustomerInCRM(phone, env) {
  const token = await getToken(env);
  if (!token) return null;
  try {
    const dc = env.ZOHO_DATACENTER ?? "in";
    const res = await fetch(
      `https://www.zohoapis.${dc}/crm/v6/Contacts/search?phone=${encodeURIComponent(`+91${phone}`)}&fields=id,Full_Name,Phone,Email,Account_Name,Customer_ID,Storage_ID,Storage_Unit,Warehouse_Location,Status,Monthly_Rate`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const contact = data.data?.[0];
    if (!contact) return null;
    return {
      customerId: contact.Customer_ID ?? contact.id,
      name: contact.Full_Name ?? "Customer",
      phone: contact.Phone ?? `+91${phone}`,
      email: contact.Email ?? "",
      storageId: contact.Storage_ID ?? `AVT-STO-${Math.floor(Math.random() * 9e3) + 1e3}`,
      warehouseLoc: contact.Warehouse_Location ?? "WH1-A-1",
      storageType: contact.Account_Name ?? "Household Storage",
      status: contact.Status ?? "Active",
      monthlyRate: contact.Monthly_Rate ?? 0
    };
  } catch {
    return null;
  }
}
__name(lookupCustomerInCRM, "lookupCustomerInCRM");
async function lookupInGoogleSheets(phone) {
  try {
    const url = "https://docs.google.com/spreadsheets/d/1gQl6Qm3x77zMtvN7C9tIpnwt3usnAeUgTaAyQgKpT3o/gviz/tq?tqx=out:csv&gid=1125867702";
    const res = await fetch(url);
    const csv = await res.text();
    const rows = csv.split("\n").map(
      (row) => row.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim())
    );
    const customerRow = rows.find((row, i) => i > 0 && row[2] === phone);
    if (!customerRow) return null;
    return {
      customerId: customerRow[0],
      name: customerRow[1],
      phone: customerRow[2],
      altPhone: customerRow[3],
      email: customerRow[4],
      address: customerRow[5],
      onboardingDate: customerRow[7],
      storageId: `AVT-STO-${Math.floor(Math.random() * 9e3) + 1e3}`,
      warehouseLoc: "WH1-A-1",
      storageType: "Household Storage",
      status: "Active",
      monthlyRate: 4500
    };
  } catch {
    return null;
  }
}
__name(lookupInGoogleSheets, "lookupInGoogleSheets");
var onRequestPost4 = /* @__PURE__ */ __name(async ({ request, env }) => {
  if (!env.AVATI_KV) {
    return new Response(JSON.stringify({ error: "KV not configured" }), { status: 503, headers: CORS_HEADERS4 });
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: CORS_HEADERS4 });
  }
  const { phone, otp } = body;
  const normalised = (phone ?? "").replace(/\D/g, "").slice(-10);
  if (normalised.length !== 10 || !otp) {
    return new Response(JSON.stringify({ error: "Phone and OTP are required" }), { status: 400, headers: CORS_HEADERS4 });
  }
  const otpKey = `otp:${normalised}`;
  const stored = await env.AVATI_KV.get(otpKey);
  if (!stored) {
    return new Response(
      JSON.stringify({ success: false, error: "OTP expired or not found. Please request a new OTP." }),
      { status: 401, headers: CORS_HEADERS4 }
    );
  }
  const { otp: storedOtp, expiry, attempts } = JSON.parse(stored);
  if (new Date(expiry) < /* @__PURE__ */ new Date()) {
    await env.AVATI_KV.delete(otpKey);
    return new Response(
      JSON.stringify({ success: false, error: "OTP has expired. Please request a new one." }),
      { status: 401, headers: CORS_HEADERS4 }
    );
  }
  if (attempts >= MAX_ATTEMPTS) {
    await env.AVATI_KV.delete(otpKey);
    return new Response(
      JSON.stringify({ success: false, error: "Too many failed attempts. Please request a new OTP." }),
      { status: 429, headers: CORS_HEADERS4 }
    );
  }
  if (otp.trim() !== storedOtp) {
    const newAttempts = attempts + 1;
    await env.AVATI_KV.put(otpKey, JSON.stringify({ otp: storedOtp, expiry, attempts: newAttempts }), {
      expirationTtl: Math.max(1, Math.floor((new Date(expiry).getTime() - Date.now()) / 1e3))
    });
    return new Response(
      JSON.stringify({
        success: false,
        error: "Incorrect OTP.",
        attemptsRemaining: MAX_ATTEMPTS - newAttempts
      }),
      { status: 401, headers: CORS_HEADERS4 }
    );
  }
  await env.AVATI_KV.delete(otpKey);
  const customer = await lookupCustomerInCRM(normalised, env) ?? await lookupInGoogleSheets(normalised);
  if (!customer) {
    return new Response(
      JSON.stringify({ success: false, error: "No account found with this phone number." }),
      { status: 404, headers: CORS_HEADERS4 }
    );
  }
  return new Response(
    JSON.stringify({ success: true, customer }),
    { status: 200, headers: CORS_HEADERS4 }
  );
}, "onRequestPost");
var onRequestOptions4 = /* @__PURE__ */ __name(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS4 });
}, "onRequestOptions");

// api/zoho-form-submit.ts
var ZOHO_RECORDS_URL = "https://forms.zohopublic.in/avatisafestorage1/form/Contactdetails/formperma/1d2Scw-4Eanc9NE1BnuHC0VwRFl8nlDx-362SOYaalI/records";
var COMPANY_NAME = "Avati Website Lead";
var QUOTE_METHOD_TO_RADIO = {
  inventory: "Live Quotation",
  upload: "Upload 360 Video",
  visit: "Book Survey"
};
var CORS_HEADERS5 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function validate(body) {
  const name = (body.name ?? "").trim();
  if (name.length < 2) return "Please enter your full name.";
  const phoneDigits = (body.phone ?? "").replace(/\D/g, "");
  if (phoneDigits.length < 10) return "Please enter a valid 10-digit phone number.";
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (!body.quoteMethod || !QUOTE_METHOD_TO_RADIO[body.quoteMethod]) {
    return "Please select a quote method.";
  }
  return null;
}
__name(validate, "validate");
function buildZohoPayload(body) {
  return {
    SingleLine: COMPANY_NAME,
    SingleLine1: (body.name ?? "").trim(),
    PhoneNumber: (body.phone ?? "").trim(),
    SingleLine2: (body.email ?? "").trim(),
    Radio: QUOTE_METHOD_TO_RADIO[body.quoteMethod],
    REFERRER_NAME: body.referrer ?? "https://www.avatisafestorage.com/get-quote"
  };
}
__name(buildZohoPayload, "buildZohoPayload");
var onRequestOptions5 = /* @__PURE__ */ __name(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS5 });
}, "onRequestOptions");
var onRequestPost5 = /* @__PURE__ */ __name(async ({ request }) => {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request body." }, 400);
  }
  const validationError = validate(body);
  if (validationError) {
    return json({ success: false, error: validationError }, 400);
  }
  try {
    const zohoRes = await fetch(ZOHO_RECORDS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/zoho.forms-v1+json"
      },
      body: JSON.stringify(buildZohoPayload(body)),
      signal: AbortSignal.timeout(6e3)
    });
    const text = await zohoRes.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[zoho-form-submit] Non-JSON response:", text.slice(0, 300));
      return json({ success: false, error: "Zoho Forms returned an unexpected response." }, 502);
    }
    if (!zohoRes.ok) {
      console.error("[zoho-form-submit] Zoho error:", zohoRes.status, data);
      return json({ success: false, error: "Zoho Forms rejected the submission." }, 502);
    }
    const recordId = data.encoded_string;
    if (!recordId) {
      console.error("[zoho-form-submit] Missing encoded_string:", data);
      return json({ success: false, error: "Zoho Forms did not confirm the submission." }, 502);
    }
    return json({ success: true, recordId }, 200);
  } catch (err) {
    console.error("[zoho-form-submit] Proxy error:", err);
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return json(
      { success: false, error: timedOut ? "Zoho Forms timed out. Please try again." : "Unable to reach Zoho Forms. Please try again." },
      timedOut ? 504 : 500
    );
  }
}, "onRequestPost");
function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS5, "Content-Type": "application/json" }
  });
}
__name(json, "json");

// api/zoho-proxy.ts
var _cachedToken = null;
var _tokenExpiry = 0;
async function getAccessToken3(env) {
  if (_cachedToken && Date.now() < _tokenExpiry - 6e4) {
    return _cachedToken;
  }
  const datacenter = env.ZOHO_DATACENTER ?? "in";
  const res = await fetch(`https://accounts.zoho.${datacenter}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN
    }).toString()
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error("Token refresh failed");
  _cachedToken = data.access_token;
  _tokenExpiry = Date.now() + (Number(data.expires_in) || 3300) * 1e3;
  return _cachedToken;
}
__name(getAccessToken3, "getAccessToken");
function resolveTargetUrl(target, datacenter, booksOrgId) {
  if (target.startsWith("creator/")) {
    return `https://creator.zoho.${datacenter}/api/${target.replace("creator/", "")}`;
  }
  if (target.startsWith("books/")) {
    const suffix = target.replace("books/", "");
    const orgParam = booksOrgId ? `&organization_id=${booksOrgId}` : "";
    return `https://www.zohoapis.${datacenter}/${suffix}${orgParam}`;
  }
  return `https://www.zohoapis.${datacenter}/${target}`;
}
__name(resolveTargetUrl, "resolveTargetUrl");
var CORS_HEADERS6 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var onRequestGet = /* @__PURE__ */ __name(async ({ request, env }) => {
  const url = new URL(request.url);
  const target = url.searchParams.get("target");
  if (!target) {
    return new Response(JSON.stringify({ error: "Missing target parameter" }), { status: 400, headers: { ...CORS_HEADERS6, "Content-Type": "application/json" } });
  }
  const extraParams = new URLSearchParams();
  url.searchParams.forEach((v, k) => {
    if (k !== "target") extraParams.set(k, v);
  });
  try {
    const token = await getAccessToken3(env);
    const datacenter = env.ZOHO_DATACENTER ?? "in";
    const zohoUrl = resolveTargetUrl(target, datacenter, env.ZOHO_BOOKS_ORG_ID);
    const finalUrl = extraParams.toString() ? `${zohoUrl}?${extraParams}` : zohoUrl;
    const zohoRes = await fetch(finalUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` }
    });
    const data = await zohoRes.text();
    return new Response(data, {
      status: zohoRes.status,
      headers: {
        ...CORS_HEADERS6,
        "Content-Type": zohoRes.headers.get("Content-Type") ?? "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...CORS_HEADERS6, "Content-Type": "application/json" } });
  }
}, "onRequestGet");
var onRequestPost6 = /* @__PURE__ */ __name(async ({ request, env }) => {
  let body = {};
  try {
    body = await request.json();
  } catch {
  }
  const target = body.target;
  if (!target) {
    return new Response(JSON.stringify({ error: "Missing target in body" }), { status: 400, headers: { ...CORS_HEADERS6, "Content-Type": "application/json" } });
  }
  try {
    const token = await getAccessToken3(env);
    const datacenter = env.ZOHO_DATACENTER ?? "in";
    const zohoUrl = resolveTargetUrl(target, datacenter, env.ZOHO_BOOKS_ORG_ID);
    const zohoRes = await fetch(zohoUrl, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body.data ?? {})
    });
    const data = await zohoRes.text();
    return new Response(data, {
      status: zohoRes.status,
      headers: { ...CORS_HEADERS6, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...CORS_HEADERS6, "Content-Type": "application/json" } });
  }
}, "onRequestPost");
var onRequestOptions6 = /* @__PURE__ */ __name(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS6 });
}, "onRequestOptions");

// api/zoho-token.ts
var onRequestPost7 = /* @__PURE__ */ __name(async ({ request, env }) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.avatisafestorage.com",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  const origin = request.headers.get("Origin") ?? "";
  const allowedOrigins = [
    "https://www.avatisafestorage.com",
    "https://avatisafestorage.com",
    // Also allow admin subdomain
    "https://admin.avatisafestorage.com",
    // Allow localhost for development
    "http://localhost:5173",
    "http://localhost:3000"
  ];
  if (!allowedOrigins.some((o) => origin.startsWith(o))) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }
  if (!env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET || !env.ZOHO_REFRESH_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Zoho OAuth not configured on server" }),
      { status: 503, headers: corsHeaders }
    );
  }
  const datacenter = env.ZOHO_DATACENTER ?? "in";
  const tokenUrl = `https://accounts.zoho.${datacenter}/oauth/v2/token`;
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN
    });
    const zohoResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const data = await zohoResponse.json();
    if (!zohoResponse.ok || data.error) {
      console.error("[zoho-token] Zoho returned error:", data);
      return new Response(
        JSON.stringify({ error: "Token refresh failed", detail: data.error }),
        { status: 502, headers: corsHeaders }
      );
    }
    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        expires_in: data.expires_in ?? 3600,
        api_domain: data.api_domain
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("[zoho-token] Fetch error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}, "onRequestPost");
var onRequestOptions7 = /* @__PURE__ */ __name(async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}, "onRequestOptions");

// ../.wrangler/tmp/pages-JS0IPj/functionsRoutes-0.013447915573212232.mjs
var routes = [
  {
    routePath: "/api/media/upload",
    mountPath: "/api/media",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/media/upload",
    mountPath: "/api/media",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/leads",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/leads",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/otp-send",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/api/otp-send",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/otp-verify",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions4]
  },
  {
    routePath: "/api/otp-verify",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/zoho-form-submit",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions5]
  },
  {
    routePath: "/api/zoho-form-submit",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/zoho-proxy",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/zoho-proxy",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions6]
  },
  {
    routePath: "/api/zoho-proxy",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/zoho-token",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions7]
  },
  {
    routePath: "/api/zoho-token",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  }
];

// C:/Users/Neyo Leroy/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/Neyo Leroy/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// C:/Users/Neyo Leroy/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/Neyo Leroy/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-Z4arPY/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// C:/Users/Neyo Leroy/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-Z4arPY/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.08267597446063046.mjs.map
