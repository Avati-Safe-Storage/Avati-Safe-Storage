// ============================================================
//  Avati Safe Storage — Zoho Flow Client
//  Triggers Zoho Flow webhooks for automation sequences.
//  Used by: Quote funnel, OTP, payment reminders, retrieval alerts.
//
//  Set webhook URLs in Cloudflare Pages environment variables.
//  Frontend reads them via VITE_ prefix.
// ============================================================

// ── Webhook URL registry ─────────────────────────────────────
// Add your Zoho Flow webhook URLs to .env / Cloudflare Pages env vars
export const FLOW_WEBHOOKS = {
  // Quote funnel automations
  QUOTE_CONTACT_CAPTURED:  import.meta.env.VITE_FLOW_WEBHOOK_CONTACT_CAPTURED  as string,
  QUOTE_STORAGE_SELECTED:  import.meta.env.VITE_FLOW_WEBHOOK_STORAGE_SELECTED  as string,
  QUOTE_INVENTORY_ENTERED: import.meta.env.VITE_FLOW_WEBHOOK_INVENTORY_ENTERED as string,
  QUOTE_MEDIA_UPLOADED:    import.meta.env.VITE_FLOW_WEBHOOK_MEDIA_UPLOADED    as string,
  QUOTE_REQUESTED:         import.meta.env.VITE_FLOW_WEBHOOK_QUOTE_REQUESTED   as string,

  // OTP delivery
  OTP_SEND:                import.meta.env.VITE_FLOW_WEBHOOK_OTP_SEND          as string,

  // Customer lifecycle
  RETRIEVAL_REQUESTED:     import.meta.env.VITE_FLOW_WEBHOOK_RETRIEVAL         as string,
  PAYMENT_REMINDER:        import.meta.env.VITE_FLOW_WEBHOOK_PAYMENT_REMINDER  as string,
  WELCOME_EMAIL:           import.meta.env.VITE_FLOW_WEBHOOK_WELCOME           as string,
} as const;

export type FlowWebhookKey = keyof typeof FLOW_WEBHOOKS;

// ── Payload types ────────────────────────────────────────────
export interface FlowBasePayload {
  timestamp: string;          // ISO
  source: 'website' | 'portal' | 'admin';
  sessionId?: string;         // For correlating multi-step events
}

export interface ContactCapturedPayload extends FlowBasePayload {
  name: string;
  phone: string;
  email: string;
  quoteMethod: 'inventory' | 'upload' | 'visit';
  referrer?: string;
}

export interface StorageSelectedPayload extends FlowBasePayload {
  phone: string;
  storageType: string;
}

export interface InventoryEnteredPayload extends FlowBasePayload {
  phone: string;
  storageType: string;
  inventorySummary: string;   // Human-readable e.g. "2x Sofa, 1x Fridge"
  itemCount: number;
  estimatedMonthly: number;
}

export interface QuoteRequestedPayload extends FlowBasePayload {
  name: string;
  phone: string;
  email: string;
  storageType: string;
  plan: string;
  monthlyEstimate: number;
  totalFirstMonth: number;
  pickupDate?: string;
  area?: string;
  packingRequired: boolean;
  transportRequired: boolean;
  inventoryList: string;
  gstin?: string;
}

export interface OTPPayload extends FlowBasePayload {
  phone: string;
  otp: string;
  otpExpiry: string;          // ISO timestamp — OTP is valid for 10 minutes
  channel: 'sms' | 'whatsapp' | 'email';
  purpose: 'login' | 'retrieval_confirm';
}

// ── Core trigger function ────────────────────────────────────
/**
 * Fires a Zoho Flow webhook with a JSON payload.
 * Uses a best-effort fire-and-forget pattern — failures are logged
 * but never surface to the user (automations should not block UX).
 *
 * @param webhookKey  Key from FLOW_WEBHOOKS
 * @param payload     Typed payload object
 * @returns           true if the webhook returned 2xx
 */
export async function triggerFlow(
  webhookKey: FlowWebhookKey,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const webhookUrl = FLOW_WEBHOOKS[webhookKey];

  if (!webhookUrl) {
    console.warn(`[ZohoFlow] Webhook not configured: ${webhookKey}`);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        source: 'website',
      }),
    });

    if (!response.ok) {
      console.error(`[ZohoFlow] Webhook ${webhookKey} returned ${response.status}`);
      return false;
    }

    console.info(`[ZohoFlow] ✓ ${webhookKey} triggered`);
    return true;
  } catch (err) {
    // Network error — never let this break the user experience
    console.error(`[ZohoFlow] Webhook ${webhookKey} error:`, err);
    return false;
  }
}

/** Fire multiple Flow webhooks in parallel (fail-safe) */
export async function triggerFlowMulti(
  triggers: Array<{ key: FlowWebhookKey; payload: Record<string, unknown> }>,
): Promise<void> {
  await Promise.allSettled(
    triggers.map(({ key, payload }) => triggerFlow(key, payload)),
  );
}
