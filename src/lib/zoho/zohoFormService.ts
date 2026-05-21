// ============================================================
//  Avati Safe Storage — Zoho Public Form Integration
//  Submits via /api/zoho-form-submit → Zoho Forms JSON API
//  (/formperma/.../records). The legacy htmlRecords/submit
//  endpoint no longer accepts direct form posts (returns ShowError).
// ============================================================

export const ZOHO_CONTACT_FORM = {
  FORM_NAME: 'Contactdetails',
  FORM_PERMA: '1d2Scw-4Eanc9NE1BnuHC0VwRFl8nlDx-362SOYaalI',
  COMPANY_NAME: 'Avati Website Lead',
} as const;

/** Field link names from the live Zoho form HTML */
export const ZOHO_FORM_FIELDS = {
  company: 'SingleLine',
  name: 'SingleLine1',
  phone: 'PhoneNumber',
  email: 'SingleLine2',
  quoteMethod: 'Radio',
} as const;

export type QuoteMethodId = 'inventory' | 'upload' | 'visit';

export interface ZohoContactFormPayload {
  name: string;
  phone: string;
  email: string;
  quoteMethod: QuoteMethodId;
}

export interface ZohoFormSubmitResult {
  success: boolean;
  error?: string;
  recordId?: string;
}

const QUOTE_METHOD_TO_RADIO: Record<QuoteMethodId, string> = {
  inventory: 'Live Quotation',
  upload: 'Upload 360 Video',
  visit: 'Book Survey',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_PATH = '/api/zoho-form-submit';

/** Client-side validation aligned with the quote generator step 1 rules. */
export function validateZohoContactPayload(payload: ZohoContactFormPayload): string | null {
  const name = payload.name.trim();
  if (!name || name.length < 2) {
    return 'Please enter your full name.';
  }

  const phoneDigits = payload.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return 'Please enter a valid 10-digit phone number.';
  }

  const email = payload.email.trim();
  if (!email || !EMAIL_RE.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (!QUOTE_METHOD_TO_RADIO[payload.quoteMethod]) {
    return 'Please select a quote method.';
  }

  return null;
}

/** Submits contact + quote method to Zoho via the server proxy. */
export async function submitZohoContactForm(
  payload: ZohoContactFormPayload,
): Promise<ZohoFormSubmitResult> {
  const validationError = validateZohoContactPayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        quoteMethod: payload.quoteMethod,
        referrer: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });

    const data = (await res.json()) as ZohoFormSubmitResult & { error?: string };

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error ?? 'Could not submit your details. Please try again.',
      };
    }

    console.info('[ZohoForm] Lead captured', {
      company: ZOHO_CONTACT_FORM.COMPANY_NAME,
      quoteMethod: QUOTE_METHOD_TO_RADIO[payload.quoteMethod],
      recordId: data.recordId,
    });

    return { success: true, recordId: data.recordId };
  } catch (err) {
    console.error('[ZohoForm] Submission failed:', err);
    return {
      success: false,
      error: 'Something went wrong while sending your details. Please try again.',
    };
  }
}
