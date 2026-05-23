// ============================================================
//  Cloudflare Pages Function: POST /api/zoho-form-submit
//  Proxies quote contact data to Zoho Forms JSON API.
//  (Browser cannot call Zoho directly — no CORS on /records.)
// ============================================================

const ZOHO_RECORDS_URL =
  'https://forms.zohopublic.in/avatisafestorage1/form/Contactdetails/formperma/1d2Scw-4Eanc9NE1BnuHC0VwRFl8nlDx-362SOYaalI/records';

const COMPANY_NAME = 'Avati Website Lead';

const QUOTE_METHOD_TO_RADIO: Record<string, string> = {
  inventory: 'Live Quotation',
  upload: 'Upload 360 Video',
  visit: 'Book Survey',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface SubmitBody {
  name?: string;
  phone?: string;
  email?: string;
  quoteMethod?: string;
  referrer?: string;
}

function validate(body: SubmitBody): string | null {
  const name = (body.name ?? '').trim();
  if (name.length < 2) return 'Please enter your full name.';

  const phoneDigits = (body.phone ?? '').replace(/\D/g, '');
  if (phoneDigits.length < 10) return 'Please enter a valid 10-digit phone number.';

  const email = (body.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';

  if (!body.quoteMethod || !QUOTE_METHOD_TO_RADIO[body.quoteMethod]) {
    return 'Please select a quote method.';
  }

  return null;
}

function buildZohoPayload(body: SubmitBody): Record<string, string> {
  return {
    SingleLine: COMPANY_NAME,
    SingleLine1: (body.name ?? '').trim(),
    PhoneNumber: (body.phone ?? '').trim(),
    SingleLine2: (body.email ?? '').trim(),
    Radio: QUOTE_METHOD_TO_RADIO[body.quoteMethod!],
    REFERRER_NAME: body.referrer ?? 'https://www.avatisafestorage.com/get-quote',
  };
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  let body: SubmitBody = {};
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return json({ success: false, error: 'Invalid request body.' }, 400);
  }

  const validationError = validate(body);
  if (validationError) {
    return json({ success: false, error: validationError }, 400);
  }

  try {
    const zohoRes = await fetch(ZOHO_RECORDS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/zoho.forms-v1+json',
      },
      body: JSON.stringify(buildZohoPayload(body)),
      signal: AbortSignal.timeout(6_000),
    });

    const text = await zohoRes.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      console.error('[zoho-form-submit] Non-JSON response:', text.slice(0, 300));
      return json({ success: false, error: 'Zoho Forms returned an unexpected response.' }, 502);
    }

    if (!zohoRes.ok) {
      console.error('[zoho-form-submit] Zoho error:', zohoRes.status, data);
      return json({ success: false, error: 'Zoho Forms rejected the submission.' }, 502);
    }

    const recordId = data.encoded_string as string | undefined;
    if (!recordId) {
      console.error('[zoho-form-submit] Missing encoded_string:', data);
      return json({ success: false, error: 'Zoho Forms did not confirm the submission.' }, 502);
    }

    return json({ success: true, recordId }, 200);
  } catch (err) {
    console.error('[zoho-form-submit] Proxy error:', err);
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    return json(
      { success: false, error: timedOut ? 'Zoho Forms timed out. Please try again.' : 'Unable to reach Zoho Forms. Please try again.' },
      timedOut ? 504 : 500,
    );
  }
};

function json(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
