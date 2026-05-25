// ============================================================
//  Avati Safe Storage — Analytics Event Catalog
//  Typed event names and payloads for GA4 tracking
//  All events follow snake_case GA4 convention
// ============================================================

export const ANALYTICS_EVENTS = {
  // ── Quote funnel ────────────────────────────────────────────
  QUOTE_STARTED:          'quote_started',
  QUOTE_STEP_COMPLETED:   'quote_step_completed',
  QUOTE_SUBMITTED:        'quote_submitted',
  QUOTE_PDF_DOWNLOADED:   'quote_pdf_downloaded',
  QUOTE_WHATSAPP_CLICKED: 'quote_whatsapp_clicked',
  QUOTE_RESET:            'quote_reset',

  // ── Lead capture ────────────────────────────────────────────
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  OTP_REQUESTED:          'otp_requested',
  OTP_VERIFIED:           'otp_verified',
  OTP_FAILED:             'otp_failed',

  // ── Navigation ──────────────────────────────────────────────
  NAV_CLICK:              'nav_click',
  CTA_CLICK:              'cta_click',
  WHATSAPP_CLICK:         'whatsapp_click',
  PHONE_CLICK:            'phone_click',

  // ── Content ─────────────────────────────────────────────────
  FAQ_EXPANDED:           'faq_expanded',
  TESTIMONIAL_VIEWED:     'testimonial_viewed',
  BLOG_POST_VIEWED:       'blog_post_viewed',
  AREA_PAGE_VIEWED:       'area_page_viewed',

  // ── Portal ──────────────────────────────────────────────────
  PORTAL_LOGIN:           'portal_login',
  PORTAL_LOGOUT:          'portal_logout',
  RETRIEVAL_REQUESTED:    'retrieval_requested',
  PAYMENT_INITIATED:      'payment_initiated',
  INVOICE_DOWNLOADED:     'invoice_downloaded',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

// ── Typed event payloads ─────────────────────────────────────
export interface QuoteStepPayload {
  step_number: number;
  step_name: string;
  storage_type?: string;
  quote_method?: string;
}

export interface QuoteSubmittedPayload {
  storage_type: string;
  plan: string;
  monthly_value: number;
  area: string;
}

export interface AreaPagePayload {
  service_type: string;
  zone_id: string;
  area_slug: string;
  area_name: string;
}
