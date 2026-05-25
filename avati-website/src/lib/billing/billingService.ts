// ============================================================
//  Avati Safe Storage — Billing Service (Phase 7)
//  Zoho Books integration architecture for GST invoicing,
//  subscription billing, and payment reminders.
//
//  All API calls route through /api/zoho-proxy (server-side auth).
//  Configure VITE_ZOHO_BOOKS_ORG_ID in environment.
//
//  GST Rules (as implemented in QuotationSystem.tsx):
//  - Storage: 18% GST
//  - Packing & Transport: Separate, no GST (or as per agreement)
// ============================================================

import { triggerFlow } from '../zoho/zohoFlowClient';
import { cachedFetch, TTL } from '../cache/apiCache';

// ── GST Calculation ───────────────────────────────────────────
export const GST_RATE = 0.18; // 18%

export interface GSTBreakdown {
  baseAmount: number;
  cgst: number;           // 9% (intra-state)
  sgst: number;           // 9% (intra-state)
  igst: number;           // 18% (inter-state, usually 0 for local)
  totalGST: number;
  totalWithGST: number;
}

export function calculateGST(amount: number, isInterState: boolean = false): GSTBreakdown {
  const totalGST = Math.round(amount * GST_RATE);
  return {
    baseAmount:   amount,
    cgst:         isInterState ? 0 : Math.round(totalGST / 2),
    sgst:         isInterState ? 0 : Math.round(totalGST / 2),
    igst:         isInterState ? totalGST : 0,
    totalGST,
    totalWithGST: amount + totalGST,
  };
}

// ── Pro-rata calculation ──────────────────────────────────────
// Avati billing cycle: pickup date → 5th of next month, then 5th–5th monthly
export function calculateProRata(monthlyRate: number, pickupDate: string): number {
  if (!pickupDate) return monthlyRate;
  const pickup = new Date(pickupDate);
  const nextMonth = new Date(pickup.getFullYear(), pickup.getMonth() + 1, 5);
  const days = Math.max(1, Math.round((nextMonth.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
  return Math.round((monthlyRate / 30) * days);
}

// ── Invoice types ─────────────────────────────────────────────
export type InvoiceType = 'Advance' | 'Transportation' | 'Packing' | 'Monthly Storage' | 'Miscellaneous';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  gstin?: string;
  type: InvoiceType;
  period?: string;          // e.g. "2026-02-05 to 2026-03-05"
  lineItems: InvoiceLineItem[];
  gstBreakdown: GSTBreakdown;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  zohoInvoiceId?: string;   // Zoho Books invoice ID
  pdfUrl?: string;          // Zoho Books / WorkDrive PDF URL
  createdAt: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
  amount: number;
}

// ── Zoho Books API calls (via proxy) ──────────────────────────

/** Create an invoice in Zoho Books */
export async function createZohoBooksInvoice(data: {
  customerId: string;
  customerName: string;
  gstin?: string;
  lineItems: InvoiceLineItem[];
  dueDate: string;
}): Promise<{ success: boolean; invoiceId?: string; pdfUrl?: string }> {
  try {
    const totalBase = data.lineItems.reduce((sum, li) => sum + (li.taxable ? li.amount : 0), 0);
    const nonTaxable = data.lineItems.reduce((sum, li) => sum + (!li.taxable ? li.amount : 0), 0);
    const { totalGST, totalWithGST } = calculateGST(totalBase);

    const payload = {
      target: 'books/v3/invoices',
      data: {
        customer_name:   data.customerName,
        invoice_date:    new Date().toISOString().split('T')[0],
        due_date:        data.dueDate,
        line_items:      data.lineItems.map(li => ({
          name:          li.description,
          quantity:      li.quantity,
          rate:          li.unitPrice,
          tax_id:        li.taxable ? 'GST18' : undefined,
        })),
        notes: `Avati Safe Storage Invoice | Customer ID: ${data.customerId}`,
      },
    };

    const res = await fetch('/api/zoho-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[BillingService] Zoho Books not configured — returning mock invoice');
      return { success: false };
    }

    const result = await res.json() as { invoice?: { invoice_id: string } };
    return {
      success: true,
      invoiceId: result.invoice?.invoice_id,
    };
  } catch (err) {
    console.error('[BillingService] createInvoice error:', err);
    return { success: false };
  }
}

/** Send a payment reminder via Zoho Flow */
export async function sendPaymentReminder(customerId: string, customerName: string, amount: number, dueDate: string): Promise<boolean> {
  return triggerFlow('PAYMENT_REMINDER', {
    customerId,
    customerName,
    amountDue: amount,
    dueDate,
    timestamp: new Date().toISOString(),
  });
}

/** Fetch invoices for a customer (via Zoho Books) */
export async function getCustomerInvoices(customerId: string): Promise<Invoice[]> {
  return cachedFetch(`billing:invoices:${customerId}`, async () => {
    try {
      const res = await fetch(`/api/zoho-proxy?target=books/v3/invoices&customer_id=${encodeURIComponent(customerId)}`);
      if (!res.ok) return [];
      const data = await res.json() as { invoices?: any[] };
      return (data.invoices ?? []).map(mapZohoBooksInvoice);
    } catch {
      return [];
    }
  }, TTL.FIVE_MINUTES);
}

// ── Field mapper: Zoho Books → Invoice ───────────────────────
function mapZohoBooksInvoice(raw: any): Invoice {
  return {
    id:             raw.invoice_id ?? '',
    customerId:     raw.customer_id ?? '',
    customerName:   raw.customer_name ?? '',
    gstin:          raw.gst_no ?? undefined,
    type:           'Monthly Storage',
    period:         raw.notes ?? undefined,
    lineItems:      (raw.line_items ?? []).map((li: any) => ({
      description: li.name ?? li.description ?? '',
      quantity:    li.quantity ?? 1,
      unitPrice:   li.rate ?? 0,
      taxable:     !!li.tax_id,
      amount:      li.item_total ?? 0,
    })),
    gstBreakdown: calculateGST(raw.sub_total ?? 0),
    totalAmount:  raw.total ?? 0,
    dueDate:      raw.due_date ?? '',
    status:       mapInvoiceStatus(raw.status),
    zohoInvoiceId: raw.invoice_id,
    pdfUrl:        raw.invoice_url ?? undefined,
    createdAt:    raw.created_time ?? new Date().toISOString(),
  };
}

function mapInvoiceStatus(zohoStatus: string): InvoiceStatus {
  switch (zohoStatus) {
    case 'draft':    return 'Draft';
    case 'sent':     return 'Sent';
    case 'paid':     return 'Paid';
    case 'overdue':  return 'Overdue';
    case 'void':     return 'Void';
    default:         return 'Draft';
  }
}
