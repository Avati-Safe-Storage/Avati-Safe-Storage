// ============================================================
//  Avati Safe Storage — Quote Service
//  Centralised service for all quote funnel Zoho integrations.
//  Replaces direct pushToZoho() calls in QuotationSystem.tsx.
//
//  Lead Stage Progression:
//  CONTACT_CAPTURED → STORAGE_SELECTED → INVENTORY_ENTERED
//  → MEDIA_UPLOADED → QUOTE_REQUESTED
// ============================================================

import { triggerFlow, triggerFlowMulti } from './zohoFlowClient';
import { zohoApiFetch, ZOHO_CRM_BASE } from './zohoOAuthClient';
import { trackEvent } from '../analytics/analytics';
import { submitZohoContactForm } from './zohoFormService';

// ── Lead Stage Enum ──────────────────────────────────────────
export const LEAD_STAGE = {
  CONTACT_CAPTURED:  'Contact Captured',
  STORAGE_SELECTED:  'Storage Selected',
  INVENTORY_ENTERED: 'Inventory Entered',
  MEDIA_UPLOADED:    'Media Uploaded',
  QUOTE_REQUESTED:   'Quotation Generated',
} as const;

export type LeadStage = typeof LEAD_STAGE[keyof typeof LEAD_STAGE];

// ── Session tracking ─────────────────────────────────────────
function getSessionId(): string {
  let id = sessionStorage.getItem('avati_quote_session');
  if (!id) {
    id = `QS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem('avati_quote_session', id);
  }
  return id;
}

// ── Duplicate lead detection ─────────────────────────────────
/**
 * Checks if a lead with this phone number already exists in Zoho CRM.
 * Uses the authenticated API (when configured) — falls back to false on error.
 */
export async function checkDuplicateLead(phone: string): Promise<boolean> {
  try {
    const normalised = phone.replace(/\D/g, '').slice(-10);
    const response = await zohoApiFetch(
      `${ZOHO_CRM_BASE}/Leads/search?phone=${normalised}&fields=id,Mobile`,
    );
    if (!response.ok) return false;
    const data = await response.json();
    return (data.data ?? []).length > 0;
  } catch {
    // If CRM is unreachable, don't block submission
    return false;
  }
}

// ── Stage 1: Contact Captured ────────────────────────────────
export interface ContactData {
  name: string;
  phone: string;
  email: string;
  quoteMethod: 'inventory' | 'upload' | 'visit';
}

export async function captureContact(contact: ContactData): Promise<void> {
  const sessionId = getSessionId();

  await triggerFlowMulti([
    {
      key: 'QUOTE_CONTACT_CAPTURED',
      payload: { ...contact, sessionId, referrer: document.referrer },
    },
  ]);

  // Zoho public form (hidden iframe — triggers CRM automations)
  submitZohoContactForm({
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    quoteMethod: contact.quoteMethod,
  }).catch(() => {});

  trackEvent('quote_step_completed', { step_number: 1, step_name: 'contact_captured', storage_type: '' });
}

// ── Stage 2: Storage Type Selected ──────────────────────────
export async function recordStorageSelected(phone: string, storageType: string): Promise<void> {
  await triggerFlow('QUOTE_STORAGE_SELECTED', {
    phone,
    storageType,
    sessionId: getSessionId(),
  });
  trackEvent('quote_step_completed', { step_number: 2, step_name: 'storage_selected', storage_type: storageType });
}

// ── Stage 3: Inventory Entered ───────────────────────────────
export interface InventoryData {
  phone: string;
  storageType: string;
  inventorySummary: string;
  itemCount: number;
  estimatedMonthly: number;
}

export async function recordInventoryEntered(data: InventoryData): Promise<void> {
  await triggerFlow('QUOTE_INVENTORY_ENTERED', {
    ...data,
    sessionId: getSessionId(),
  });
  trackEvent('quote_step_completed', { step_number: 3, step_name: 'inventory_entered', storage_type: data.storageType });
}

// ── Stage 4: Media Uploaded ──────────────────────────────────
export async function recordMediaUploaded(phone: string, fileCount: number): Promise<void> {
  await triggerFlow('QUOTE_MEDIA_UPLOADED', {
    phone,
    fileCount,
    sessionId: getSessionId(),
    // Note: actual file upload to WorkDrive requires authenticated Zoho API
    // and must be done server-side via a Cloudflare Pages Function.
    // The function endpoint: POST /api/zoho-workdrive-upload
  });
  trackEvent('quote_step_completed', { step_number: 4, step_name: 'media_uploaded' });
}

// ── Stage 5: Quote Requested (Final Submission) ───────────────
export interface QuoteSummary {
  name: string;
  phone: string;
  email: string;
  storageType: string;
  plan: string;
  monthlyEstimate: number;
  packingAndTransport: number;
  gst: number;
  totalFirstMonth: number;
  pickupDate?: string;
  area?: string;
  packingRequired: boolean;
  transportRequired: boolean;
  inventoryList: string;
  customItems?: string;
  gstin?: string;
  duration?: number;
  buildingType?: string;
  floors?: number;
  liftAvailable?: string;
}

export async function submitQuoteRequest(summary: QuoteSummary): Promise<{ success: boolean }> {
  const sessionId = getSessionId();

  try {
    // Trigger Zoho Flow (primary automation)
    await triggerFlow('QUOTE_REQUESTED', { ...summary, sessionId });

    // Also post to Zoho CRM WebToLeadForm (existing backup — no-cors)
    await _submitToCRMWebToLead(summary);

    trackEvent('quote_submitted', {
      storage_type: summary.storageType,
      plan: summary.plan,
      monthly_value: summary.monthlyEstimate,
    });

    return { success: true };
  } catch (err) {
    console.error('[QuoteService] submitQuoteRequest error:', err);
    return { success: false };
  }
}

// ── Internal: CRM WebToLead (existing backup) ─────────────────
async function _submitToCRMWebToLead(summary: QuoteSummary): Promise<void> {
  const planMap: Record<string, string> = { basic: 'Basic', premium: 'Premium', professional: 'Pro' };

  const params = new URLSearchParams({
    xnQsjsdp:   'a953c779a14bc6e4957548782b9158470d5e0b96d0d4e9bcf6d98eed4b4824ce',
    xmIwtLD:    '877469bab2a764d5f8c16fc97b26895976af0a4990366dcf8d0516de33cee768202c367687c3cbf63287341c1660361d',
    actionType: 'TGVhZHM=',
    zc_gad:     '',
    returnURL:  'https://www.avatisafestorage.com/',
    Company:    'Avati Website Lead',
    'First Name': '',
    'Last Name':  summary.name || 'Website Lead',
    Email:        summary.email,
    Mobile:       summary.phone,
    'Lead Source': 'Online Store',
    'Lead Status': LEAD_STAGE.QUOTE_REQUESTED,
    LEADCF2:      summary.storageType,
    LEADCF3:      planMap[summary.plan] ?? 'Basic',
    LEADCF1:      summary.inventoryList,
    LEADCF5:      summary.customItems ?? '',
    LEADCF67:     String(Math.round(summary.monthlyEstimate)),
    LEADCF66:     String(Math.round(summary.packingAndTransport)),
    Description:  `Pickup: ${summary.pickupDate ?? 'TBD'} | ${summary.duration ?? 1} months | ${summary.buildingType ?? 'N/A'} | Floor ${summary.floors ?? 0} | Lift: ${summary.liftAvailable ?? 'N/A'}`,
    'Address - Flat / House No./ Building / Apartment Name': summary.area ?? '',
    aG9uZXlwb3Q: '', // honeypot
  });

  if (summary.packingRequired)   params.append('LEADCF101', 'on');
  if (summary.transportRequired) params.append('LEADCF102', 'on');
  if (summary.gstin)             params.append('LEADCF10',  summary.gstin);

  await fetch('https://crm.zoho.in/crm/WebToLeadForm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    mode: 'no-cors',
  });
}
