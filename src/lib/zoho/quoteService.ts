// ============================================================
//  Avati Safe Storage — Quote Service
//  Centralised Zoho CRM + Flow automations for the quote funnel.
// ============================================================

import { triggerFlow, triggerFlowMulti } from './zohoFlowClient';
import { submitZohoContactForm, type QuoteMethodId } from './zohoFormService';
import { trackEvent } from '../analytics/analytics';

// ── Lead stages (CRM Lead Status field values) ───────────────
export const CRM_LEAD_STATUS = {
  CONTACT: 'Contact only',
  STORAGE: 'Storage Type Selected',
  INVENTORY: 'Inventory Provided',
  LOGISTICS: 'Logistics Provided',
  PLAN: 'Plan selected',
  QUOTE: 'Quotation Generated',
} as const;

export type CrmLeadStatus = typeof CRM_LEAD_STATUS[keyof typeof CRM_LEAD_STATUS];

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

// ── CRM WebToLead (background, non-blocking) ─────────────────
export function syncCrmLead(snapshot: QuoteFunnelSnapshot, leadStatus: CrmLeadStatus): void {
  _submitCrmWebToLead(snapshot, leadStatus).catch((err) =>
    console.warn('[QuoteService] CRM sync failed:', err),
  );
}

function _submitCrmWebToLead(snapshot: QuoteFunnelSnapshot, leadStatus: CrmLeadStatus): Promise<void> {
  const methodMap: Record<string, string> = {
    inventory: 'Live Quotation',
    upload: 'Upload 360 Video',
    visit: 'Book Survey',
  };
  const planMap: Record<string, string> = { basic: 'Basic', premium: 'Premium', professional: 'Pro' };

  const params = new URLSearchParams({
    xnQsjsdp: 'a953c779a14bc6e4957548782b9158470d5e0b96d0d4e9bcf6d98eed4b4824ce',
    xmIwtLD: '877469bab2a764d5f8c16fc97b26895976af0a4990366dcf8d0516de33cee768202c367687c3cbf63287341c1660361d',
    actionType: 'TGVhZHM=',
    zc_gad: '',
    returnURL: 'https://www.avatisafestorage.com/',
    Company: 'Avati Website Lead',
    'First Name': '',
    'Last Name': (snapshot.customer.name || '').trim() || 'Website Lead',
    Email: snapshot.customer.email || '',
    Mobile: snapshot.customer.phone || '',
    'Lead Source': 'Online Store',
    'Lead Status': leadStatus,
    LEADCF6: methodMap[snapshot.quoteMethod] || 'Live Quotation',
    LEADCF2: snapshot.storageType || 'Household',
    LEADCF1: snapshot.inventoryList || '',
    LEADCF5: snapshot.customItems || '',
    LEADCF3: planMap[snapshot.selectedPlan] || 'Basic',
    Description: `Pickup: ${snapshot.logistics.pickupDate || 'TBD'} | ${snapshot.logistics.duration || 1} months | ${snapshot.logistics.buildingType || 'N/A'} | Floor ${snapshot.logistics.floors || 0} | Lift: ${snapshot.logistics.liftAvailable}`,
    'Address - Flat / House No./ Building / Apartment Name': snapshot.logistics.pickupArea || '',
    aG9uZXlwb3Q: '',
  });

  if (snapshot.logistics.packingRequired) params.append('LEADCF101', 'on');
  if (snapshot.logistics.transportRequired) params.append('LEADCF102', 'on');
  if (snapshot.gstin) params.append('LEADCF10', snapshot.gstin);

  const monthly = Math.round(snapshot.monthlyStorage);
  const ptCharge = Math.round(snapshot.packingAndTransport);
  if (monthly > 0) params.append('LEADCF67', monthly.toString());
  if (ptCharge > 0) params.append('LEADCF66', ptCharge.toString());

  return fetch('https://crm.zoho.in/crm/WebToLeadForm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    mode: 'no-cors',
  }).then(() => {
    console.info('[QuoteService] CRM sync →', leadStatus);
  });
}

// ── Step automations (Flow + CRM, all non-blocking) ──────────

/** After step 1 — CRM backup only (Zoho Form handled separately). */
export function automateContactCaptured(snapshot: QuoteFunnelSnapshot): void {
  syncCrmLead(snapshot, CRM_LEAD_STATUS.CONTACT);
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

  // Send lead to Make.com Webhook
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
  syncCrmLead(snapshot, CRM_LEAD_STATUS.STORAGE);
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
  syncCrmLead(snapshot, CRM_LEAD_STATUS.INVENTORY);
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
  syncCrmLead(snapshot, CRM_LEAD_STATUS.LOGISTICS);
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
  syncCrmLead(snapshot, CRM_LEAD_STATUS.PLAN);
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

/** Final confirm — plan sync, full quote, Zoho Form refresh. */
export async function automateQuoteConfirmed(snapshot: QuoteFunnelSnapshot): Promise<void> {
  syncCrmLead(snapshot, CRM_LEAD_STATUS.PLAN);
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
    _submitCrmWebToLead(snapshot, CRM_LEAD_STATUS.QUOTE),
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
