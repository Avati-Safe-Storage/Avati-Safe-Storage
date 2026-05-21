// ============================================================
//  Cloudflare Pages Function: /api/otp-verify
//  Verifies the OTP submitted by the user against the KV-stored value.
//  On success: returns the customer data from Zoho CRM.
//  On failure: increments attempt counter, blocks after 3 failures.
//
//  Request body:
//    { phone: string, otp: string }
//
//  Response (success):
//    { success: true, customer: { ... } }
//  Response (failure):
//    { success: false, error: string, attemptsRemaining?: number }
// ============================================================

interface Env {
  AVATI_KV: KVNamespace;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_DATACENTER?: string;
}

const MAX_ATTEMPTS = 3;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// ── Token helper (inline since this is a separate function) ──
async function getToken(env: Env): Promise<string | null> {
  try {
    const dc = env.ZOHO_DATACENTER ?? 'in';
    const res = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
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
    return data.access_token as string ?? null;
  } catch {
    return null;
  }
}

// ── Customer lookup from Zoho CRM ────────────────────────────
async function lookupCustomerInCRM(phone: string, env: Env): Promise<Record<string, unknown> | null> {
  const token = await getToken(env);
  if (!token) return null;

  try {
    const dc = env.ZOHO_DATACENTER ?? 'in';
    const res = await fetch(
      `https://www.zohoapis.${dc}/crm/v6/Contacts/search?phone=${encodeURIComponent(`+91${phone}`)}&fields=id,Full_Name,Phone,Email,Account_Name,Customer_ID,Storage_ID,Storage_Unit,Warehouse_Location,Status,Monthly_Rate`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}` } },
    );

    if (!res.ok) return null;
    const data = await res.json() as { data?: any[] };
    const contact = data.data?.[0];
    if (!contact) return null;

    // Map Zoho CRM fields to our customer portal schema
    return {
      customerId:    contact.Customer_ID ?? contact.id,
      name:          contact.Full_Name ?? 'Customer',
      phone:         contact.Phone ?? `+91${phone}`,
      email:         contact.Email ?? '',
      storageId:     contact.Storage_ID ?? `AVT-STO-${Math.floor(Math.random() * 9000) + 1000}`,
      warehouseLoc:  contact.Warehouse_Location ?? 'WH1-A-1',
      storageType:   contact.Account_Name ?? 'Household Storage',
      status:        contact.Status ?? 'Active',
      monthlyRate:   contact.Monthly_Rate ?? 0,
    };
  } catch {
    return null;
  }
}

// ── Fallback: Google Sheets lookup ───────────────────────────
async function lookupInGoogleSheets(phone: string): Promise<Record<string, unknown> | null> {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1gQl6Qm3x77zMtvN7C9tIpnwt3usnAeUgTaAyQgKpT3o/gviz/tq?tqx=out:csv&gid=1125867702';
    const res = await fetch(url);
    const csv = await res.text();

    const rows = csv.split('\n').map(row =>
      row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()),
    );

    const customerRow = rows.find((row, i) => i > 0 && row[2] === phone);
    if (!customerRow) return null;

    return {
      customerId:    customerRow[0],
      name:          customerRow[1],
      phone:         customerRow[2],
      altPhone:      customerRow[3],
      email:         customerRow[4],
      address:       customerRow[5],
      onboardingDate:customerRow[7],
      storageId:     `AVT-STO-${Math.floor(Math.random() * 9000) + 1000}`,
      warehouseLoc:  'WH1-A-1',
      storageType:   'Household Storage',
      status:        'Active',
      monthlyRate:   4500,
    };
  } catch {
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AVATI_KV) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 503, headers: CORS_HEADERS });
  }

  let body: Record<string, string> = {};
  try { body = await request.json() as Record<string, string>; } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: CORS_HEADERS });
  }

  const { phone, otp } = body;
  const normalised = (phone ?? '').replace(/\D/g, '').slice(-10);

  if (normalised.length !== 10 || !otp) {
    return new Response(JSON.stringify({ error: 'Phone and OTP are required' }), { status: 400, headers: CORS_HEADERS });
  }

  // Retrieve stored OTP from KV
  const otpKey = `otp:${normalised}`;
  const stored = await env.AVATI_KV.get(otpKey);

  if (!stored) {
    return new Response(
      JSON.stringify({ success: false, error: 'OTP expired or not found. Please request a new OTP.' }),
      { status: 401, headers: CORS_HEADERS },
    );
  }

  const { otp: storedOtp, expiry, attempts } = JSON.parse(stored) as { otp: string; expiry: string; attempts: number };

  // Check expiry
  if (new Date(expiry) < new Date()) {
    await env.AVATI_KV.delete(otpKey);
    return new Response(
      JSON.stringify({ success: false, error: 'OTP has expired. Please request a new one.' }),
      { status: 401, headers: CORS_HEADERS },
    );
  }

  // Check max attempts
  if (attempts >= MAX_ATTEMPTS) {
    await env.AVATI_KV.delete(otpKey);
    return new Response(
      JSON.stringify({ success: false, error: 'Too many failed attempts. Please request a new OTP.' }),
      { status: 429, headers: CORS_HEADERS },
    );
  }

  // Verify OTP
  if (otp.trim() !== storedOtp) {
    const newAttempts = attempts + 1;
    await env.AVATI_KV.put(otpKey, JSON.stringify({ otp: storedOtp, expiry, attempts: newAttempts }), {
      expirationTtl: Math.max(1, Math.floor((new Date(expiry).getTime() - Date.now()) / 1000)),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Incorrect OTP.',
        attemptsRemaining: MAX_ATTEMPTS - newAttempts,
      }),
      { status: 401, headers: CORS_HEADERS },
    );
  }

  // OTP correct — delete it (one-time use)
  await env.AVATI_KV.delete(otpKey);

  // Look up customer: try Zoho CRM first, fall back to Google Sheets
  const customer = (await lookupCustomerInCRM(normalised, env)) ?? (await lookupInGoogleSheets(normalised));

  if (!customer) {
    return new Response(
      JSON.stringify({ success: false, error: 'No account found with this phone number.' }),
      { status: 404, headers: CORS_HEADERS },
    );
  }

  return new Response(
    JSON.stringify({ success: true, customer }),
    { status: 200, headers: CORS_HEADERS },
  );
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
