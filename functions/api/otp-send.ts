// ============================================================
//  Cloudflare Pages Function: /api/otp-send
//  Generates a 6-digit OTP, stores it in Cloudflare KV (10 min TTL),
//  then triggers a Zoho Flow webhook to deliver via SMS/email.
//
//  Required Cloudflare:
//    KV Binding: AVATI_KV  (create in Pages → Functions → KV)
//    Env var:    VITE_FLOW_WEBHOOK_OTP_SEND  (set on server side as FLOW_OTP_WEBHOOK)
//
//  Request body:
//    { phone: string, channel: "sms" | "email", email?: string, purpose: "login" }
//
//  Response:
//    { success: true, expiresIn: 600 }  or  { error: string }
// ============================================================

interface Env {
  AVATI_KV: KVNamespace;
  FLOW_OTP_WEBHOOK: string;
}

const OTP_TTL_SECONDS = 600; // 10 minutes
const OTP_RATE_LIMIT_SECONDS = 60; // 1 OTP per minute per phone

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AVATI_KV) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 503, headers: CORS_HEADERS });
  }

  let body: Record<string, string> = {};
  try { body = await request.json() as Record<string, string>; } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: CORS_HEADERS });
  }

  const { phone, channel = 'sms', email, purpose = 'login' } = body;

  // Validate phone
  const normalised = (phone ?? '').replace(/\D/g, '').slice(-10);
  if (normalised.length !== 10) {
    return new Response(JSON.stringify({ error: 'Invalid phone number' }), { status: 400, headers: CORS_HEADERS });
  }

  // Rate limit: check if an OTP was sent recently
  const rateLimitKey = `otp:ratelimit:${normalised}`;
  const existing = await env.AVATI_KV.get(rateLimitKey);
  if (existing) {
    return new Response(
      JSON.stringify({ error: 'Please wait 60 seconds before requesting another OTP' }),
      { status: 429, headers: CORS_HEADERS },
    );
  }

  // Generate OTP
  const otp = generateOTP();
  const otpKey = `otp:${normalised}`;
  const expiry = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

  // Store OTP in KV with 10-min TTL
  await env.AVATI_KV.put(otpKey, JSON.stringify({ otp, expiry, attempts: 0 }), {
    expirationTtl: OTP_TTL_SECONDS,
  });

  // Store rate-limit flag with 60s TTL
  await env.AVATI_KV.put(rateLimitKey, '1', { expirationTtl: OTP_RATE_LIMIT_SECONDS });

  // Trigger Zoho Flow to deliver OTP via SMS/email
  if (env.FLOW_OTP_WEBHOOK) {
    const webhookPayload = {
      phone: `+91${normalised}`,
      otp,
      otpExpiry: expiry,
      channel,
      email: email ?? '',
      purpose,
      timestamp: new Date().toISOString(),
    };

    // Fire-and-forget — don't block the response
    fetch(env.FLOW_OTP_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    }).catch(err => console.error('[otp-send] Flow webhook error:', err));
  } else {
    console.warn('[otp-send] FLOW_OTP_WEBHOOK not configured — OTP not delivered');
  }

  return new Response(
    JSON.stringify({ success: true, expiresIn: OTP_TTL_SECONDS }),
    { status: 200, headers: CORS_HEADERS },
  );
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
