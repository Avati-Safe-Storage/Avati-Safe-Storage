// ============================================================
//  Avati Safe Storage — Quote Service (Refactored)
//  Centralised Zoho Flow automations & events for the quote funnel.
//  No direct CRM integrations or authentication secrets are stored here.
// ============================================================

import { triggerFlow, triggerFlowMulti } from './zohoFlowClient';
import { submitZohoContactForm, type QuoteMethodId } from './zohoFormService';
import { trackEvent } from '../analytics/analytics';

// ── Lead stages ──────────────────────────────────────────────
export const LEAD_STAGE = {
  CONTACT_CAPTURED: 'Contact Captured',
  STORAGE_SELECTED: 'Storage Selected',
  INVENTORY_ENTERED: 'Inventory Entered',
  MEDIA_UPLOADED: 'Media Uploaded',
  QUOTE_REQUESTED: 'Quotation Generated',
} as const;

// ── Session tracking ─────────────────────────────────────────
function getSessionId(): string {
  let id = sessionStorage.getItem('avati_quote_session');
  if (!id) {
    id = `QS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem('avati_quote_session', id);
  }
  return id;
}

// ── Funnel snapshot (built by QuotationSystem) ───────────────
export interface QuoteFunnelSnapshot {
  customer: { name: string; phone: string; email: string };
  quoteMethod: QuoteMethodId;
  storageType: string;
  selectedPlan: string;
  inventoryList: string;
  inventorySummary: string;
  itemCount: number;
  monthlyStorage: number;
  packingAndTransport: number;
  storageGst: number;
  totalFirstMonth: number;
  customItems: string;
  logistics: {
    pickupDate: string;
    duration: number;
    buildingType: string;
    liftAvailable: string;
    floors: number;
    pickupArea: string;
    packingRequired: boolean;
    transportRequired: boolean;
  };
  gstin?: string;
  uploadedFileCount?: number;
  visitNote?: string;
}

// ── Step automations (Flow, all non-blocking & fail-silent) ──

/** After step 1 — capture contact details in flow. */
export function automateContactCaptured(snapshot: QuoteFunnelSnapshot): void {
  triggerFlowMulti([
    {
      key: 'QUOTE_CONTACT_CAPTURED',
      payload: {
        name: snapshot.customer.name,
        phone: snapshot.customer.phone,
        email: snapshot.customer.email,
        quoteMethod: snapshot.quoteMethod,
        sessionId: getSessionId(),
        referrer: document.referrer,
      },
    },
  ]).catch(() => {});

  // Parallel Send to Make.com Webhook
  fetch('https://hook.eu1.make.com/nsxcdre5idm6g2ihl2rhmjllfo3vyj6z', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: snapshot.customer.name,
      phone: snapshot.customer.phone,
      email: snapshot.customer.email,
      quoteMethod: snapshot.quoteMethod,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    }),
  }).catch((err) => {
    console.warn('[QuoteService] Make.com webhook failed:', err);
  });

  trackEvent('quote_step_completed', { step_number: 1, step_name: 'contact_captured', storage_type: '' });
}

/** Step 2 — user picked a storage type. */
export function automateStorageSelected(snapshot: QuoteFunnelSnapshot): void {
  triggerFlow('QUOTE_STORAGE_SELECTED', {
    phone: snapshot.customer.phone,
    storageType: snapshot.storageType,
    sessionId: getSessionId(),
  }).catch(() => {});
  
  trackEvent('quote_step_completed', {
    step_number: 2,
    step_name: 'storage_selected',
    storage_type: snapshot.storageType,
  });
}

/** Step 3 — inventory, media upload, or site visit. */
export function automateInventoryStep(snapshot: QuoteFunnelSnapshot): void {
  const sessionId = getSessionId();
  const phone = snapshot.customer.phone;

  if (snapshot.quoteMethod === 'upload') {
    triggerFlow('QUOTE_MEDIA_UPLOADED', {
      phone,
      fileCount: snapshot.uploadedFileCount ?? 0,
      sessionId,
    }).catch(() => {});
  } else if (snapshot.quoteMethod === 'visit') {
    triggerFlow('QUOTE_INVENTORY_ENTERED', {
      phone,
      storageType: snapshot.storageType,
      inventorySummary: snapshot.visitNote
        ? `Site visit requested: ${snapshot.visitNote}`
        : 'Site visit requested',
      itemCount: 0,
      estimatedMonthly: snapshot.monthlyStorage,
      sessionId,
    }).catch(() => {});
  } else {
    triggerFlow('QUOTE_INVENTORY_ENTERED', {
      phone,
      storageType: snapshot.storageType,
      inventorySummary: snapshot.inventorySummary,
      itemCount: snapshot.itemCount,
      estimatedMonthly: snapshot.monthlyStorage,
      sessionId,
    }).catch(() => {});
  }

  trackEvent('quote_step_completed', {
    step_number: 3,
    step_name: snapshot.quoteMethod === 'upload' ? 'media_uploaded' : 'inventory_entered',
    storage_type: snapshot.storageType,
  });
}

/** Step 4 — logistics captured. */
export function automateLogisticsStep(snapshot: QuoteFunnelSnapshot): void {
  triggerFlow('QUOTE_LOGISTICS_PROVIDED', {
    phone: snapshot.customer.phone,
    storageType: snapshot.storageType,
    pickupDate: snapshot.logistics.pickupDate,
    duration: snapshot.logistics.duration,
    buildingType: snapshot.logistics.buildingType,
    floors: snapshot.logistics.floors,
    liftAvailable: snapshot.logistics.liftAvailable,
    pickupArea: snapshot.logistics.pickupArea,
    packingRequired: snapshot.logistics.packingRequired,
    transportRequired: snapshot.logistics.transportRequired,
    sessionId: getSessionId(),
  }).catch(() => {});
  
  trackEvent('quote_step_completed', { step_number: 4, step_name: 'logistics_provided', storage_type: snapshot.storageType });
}

/** Step 5 — plan selected (before final confirm). */
export function automatePlanStep(snapshot: QuoteFunnelSnapshot): void {
  triggerFlow('QUOTE_PLAN_SELECTED', {
    phone: snapshot.customer.phone,
    storageType: snapshot.storageType,
    plan: snapshot.selectedPlan,
    monthlyEstimate: snapshot.monthlyStorage,
    totalFirstMonth: snapshot.totalFirstMonth,
    sessionId: getSessionId(),
  }).catch(() => {});
  
  trackEvent('quote_step_completed', { step_number: 5, step_name: 'plan_selected', storage_type: snapshot.storageType });
}

/** Final confirm — full quote, Zoho Form submission. */
export async function automateQuoteConfirmed(snapshot: QuoteFunnelSnapshot): Promise<void> {
  triggerFlow('QUOTE_PLAN_SELECTED', {
    phone: snapshot.customer.phone,
    storageType: snapshot.storageType,
    plan: snapshot.selectedPlan,
    monthlyEstimate: snapshot.monthlyStorage,
    totalFirstMonth: snapshot.totalFirstMonth,
    sessionId: getSessionId(),
  }).catch(() => {});

  const summary = {
    name: snapshot.customer.name,
    phone: snapshot.customer.phone,
    email: snapshot.customer.email,
    storageType: snapshot.storageType,
    plan: snapshot.selectedPlan,
    monthlyEstimate: snapshot.monthlyStorage,
    packingAndTransport: snapshot.packingAndTransport,
    gst: snapshot.storageGst,
    totalFirstMonth: snapshot.totalFirstMonth,
    pickupDate: snapshot.logistics.pickupDate,
    area: snapshot.logistics.pickupArea,
    packingRequired: snapshot.logistics.packingRequired,
    transportRequired: snapshot.logistics.transportRequired,
    inventoryList: snapshot.inventoryList,
    customItems: snapshot.customItems,
    gstin: snapshot.gstin,
    duration: snapshot.logistics.duration,
    buildingType: snapshot.logistics.buildingType,
    floors: snapshot.logistics.floors,
    liftAvailable: snapshot.logistics.liftAvailable,
  };

  await Promise.allSettled([
    triggerFlow('QUOTE_REQUESTED', { ...summary, sessionId: getSessionId() }),
    submitZohoContactForm({
      name: snapshot.customer.name,
      phone: snapshot.customer.phone,
      email: snapshot.customer.email,
      quoteMethod: snapshot.quoteMethod,
    }),
  ]);

  trackEvent('quote_submitted', {
    storage_type: snapshot.storageType,
    plan: snapshot.selectedPlan,
    monthly_value: snapshot.monthlyStorage,
  });
}
