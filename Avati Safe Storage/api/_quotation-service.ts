import { jsPDF } from "jspdf";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { calculateQuotation, formatCurrency, validateQuotation } from "../src/lib/quotationPricing";
import type { QuotationFormData, QuotationPayload } from "../src/lib/quotationTypes";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const COMPANY_NAME = "Avati Safe Storage";
const BRAND_GOLD = "#D4AF37";
const BRAND_NAVY = "#0B1F3A";

function formatPdfCurrency(amount: number) {
  return `INR ${Math.round(amount || 0).toLocaleString("en-IN")}`;
}

export function parseQuotationPayload(body: unknown): QuotationFormData {
  const raw = typeof body === "string" ? JSON.parse(body) : body;
  const data = raw as Partial<QuotationFormData>;

  return {
    fullName: String(data.fullName || "").trim(),
    phone: String(data.phone || "").trim(),
    email: String(data.email || "").trim().toLowerCase(),
    storageType: (data.storageType || "household") as QuotationFormData["storageType"],
    numberOfBoxes: Number(data.numberOfBoxes || 0),
    estimatedVolume: Number(data.estimatedVolume || 0),
    storageDuration: (data.storageDuration || "1-3") as QuotationFormData["storageDuration"],
    pickupRequired: Boolean(data.pickupRequired),
    insuranceRequired: Boolean(data.insuranceRequired),
    pickupLocation: String(data.pickupLocation || "").trim(),
    additionalNotes: String(data.additionalNotes || "").trim(),
  };
}

export function assertValidQuotation(data: QuotationFormData) {
  const errors = validateQuotation(data);
  if (Object.keys(errors).length > 0) {
    const error = new Error("Quotation details are incomplete.");
    Object.assign(error, { statusCode: 422, errors });
    throw error;
  }
}

export function generateQuotationPdf(payload: QuotationPayload) {
  const { customer, quote } = payload;
  const doc = new jsPDF();
  const validUntil = new Date(quote.validUntil).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  doc.setFillColor(BRAND_NAVY);
  doc.rect(0, 0, 210, 34, "F");
  doc.setFillColor(BRAND_GOLD);
  doc.roundedRect(16, 8, 12, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("A", 20, 17);
  doc.text(COMPANY_NAME, 34, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Professional storage quotation", 16, 26);
  doc.setTextColor(BRAND_GOLD);
  doc.text(quote.quotationId, 150, 18);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Customer Details", 16, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${customer.fullName}`, 16, 58);
  doc.text(`Phone: ${customer.phone}`, 16, 66);
  doc.text(`Email: ${customer.email}`, 16, 74);
  doc.text(`Pickup Location: ${customer.pickupLocation || "Not requested"}`, 16, 82, { maxWidth: 178 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Quotation Summary", 16, 100);

  const rows = [
    ["Storage pricing", quote.storageMonthly],
    ["Volume pricing", quote.volumeMonthly],
    ["Duration discount", -quote.durationDiscount],
    ["Pickup charges", quote.pickupCharges],
    ["Insurance", quote.insurance],
    ["Subtotal", quote.subtotal],
    ["GST (18%)", quote.gst],
    ["Total estimate", quote.totalEstimate],
  ];

  let y = 112;
  doc.setFontSize(10);
  rows.forEach(([label, value], index) => {
    const isTotal = index === rows.length - 1;
    if (isTotal) {
      doc.setFillColor(245, 245, 245);
      doc.rect(16, y - 6, 178, 10, "F");
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    doc.text(String(label), 20, y);
    const amount = Number(value) < 0 ? `-${formatPdfCurrency(Math.abs(Number(value)))}` : formatPdfCurrency(Number(value));
    doc.text(amount, 164, y, { align: "right" });
    y += 10;
  });

  doc.setFont("helvetica", "bold");
  doc.text(`Estimated monthly pricing: ${formatPdfCurrency(quote.totalMonthly)}`, 16, y + 8);
  doc.text(`Valid until: ${validUntil}`, 16, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Terms", 16, y + 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const terms = [
    "This quotation is indicative and subject to final item inspection.",
    "GST is calculated at 18% as applicable.",
    "Pickup charges may vary for special handling, access restrictions, or outstation requests.",
    "Insurance is optional and activated only after customer approval and documentation.",
  ];
  doc.text(terms, 16, y + 46, { maxWidth: 178, lineHeightFactor: 1.5 });

  doc.setDrawColor(212, 175, 55);
  doc.line(16, 278, 194, 278);
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`${COMPANY_NAME} | Secure storage, pickup, and retrieval services`, 16, 286);

  return Buffer.from(doc.output("arraybuffer"));
}

export async function storeQuotation(payload: QuotationPayload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { skipped: true, reason: "Supabase environment variables are not configured." };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const { customer, quote } = payload;
  const { error } = await supabase.from("quotation_requests").insert({
    quotation_id: quote.quotationId,
    full_name: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    storage_type: customer.storageType,
    number_of_boxes: customer.numberOfBoxes,
    estimated_volume: customer.estimatedVolume,
    storage_duration: customer.storageDuration,
    pickup_required: customer.pickupRequired,
    insurance_required: customer.insuranceRequired,
    pickup_location: customer.pickupLocation,
    additional_notes: customer.additionalNotes,
    pricing_breakdown: quote,
    total_estimate: quote.totalEstimate,
    valid_until: quote.validUntil,
  });

  if (error) throw error;
  return { skipped: false };
}

export async function emailQuotation(payload: QuotationPayload, pdf: Buffer) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.QUOTE_FROM_EMAIL || "Avati Safe Storage <quotes@avatisafestorage.com>";
  const adminEmail = process.env.QUOTE_ADMIN_EMAIL;

  if (!resendApiKey) {
    return { skipped: true, reason: "Resend API key is not configured." };
  }

  const resend = new Resend(resendApiKey);
  const { customer, quote } = payload;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h2 style="color:${BRAND_NAVY};margin-bottom:8px">Your Avati Safe Storage quotation</h2>
      <p>Hello ${customer.fullName},</p>
      <p>Your quotation <strong>${quote.quotationId}</strong> is attached as a PDF.</p>
      <p><strong>Total estimate:</strong> ${formatCurrency(quote.totalEstimate)}<br/>
      <strong>Estimated monthly pricing:</strong> ${formatCurrency(quote.totalMonthly)}</p>
      <p>This quotation is valid for ${quote.validityDays} days.</p>
      <p>Regards,<br/>Avati Safe Storage</p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [customer.email],
    cc: adminEmail ? [adminEmail] : undefined,
    subject: `Avati Safe Storage quotation ${quote.quotationId}`,
    html,
    attachments: [
      {
        filename: `${quote.quotationId}.pdf`,
        content: pdf.toString("base64"),
      },
    ],
  });

  return { skipped: false };
}

export function sendApiError(response: ApiResponse, error: unknown) {
  const statusCode = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 500;
  response.status(statusCode).json({
    message: error instanceof Error ? error.message : "Unexpected quotation service error.",
    errors: typeof error === "object" && error && "errors" in error ? error.errors : undefined,
  });
}
