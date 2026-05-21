// ============================================================
//  Avati Safe Storage — Barcode & QR Utilities
//  Generates and validates barcodes for stored items.
//  Barcode format: AVT-{CustomerID}-{ItemID}
//  QR code: URL pointing to the item's admin detail page
// ============================================================

// ── Barcode format ────────────────────────────────────────────
// AVT-CUS-0001-ITEM-0042
// Prefix: AVT (always)
// Customer segment: CUS-{4-digit padded customer number}
// Item segment: ITEM-{4-digit padded item number}

export function generateBarcode(customerId: string, itemId: string): string {
  // Extract numeric portions
  const custNum = customerId.replace(/\D/g, '').slice(-4).padStart(4, '0');
  const itemNum = itemId.replace(/\D/g, '').slice(-4).padStart(4, '0');
  return `AVT-C${custNum}-I${itemNum}`;
}

// ── Validate barcode format ───────────────────────────────────
export function validateBarcode(barcode: string): boolean {
  return /^AVT-C\d{4}-I\d{4}$/.test(barcode);
}

// ── Parse barcode into its parts ─────────────────────────────
export interface ParsedBarcode {
  customerNum: string;
  itemNum: string;
  raw: string;
}

export function parseBarcode(barcode: string): ParsedBarcode | null {
  const match = barcode.match(/^AVT-C(\d{4})-I(\d{4})$/);
  if (!match) return null;
  return {
    customerNum: match[1],
    itemNum:     match[2],
    raw:         barcode,
  };
}

// ── Generate QR code URL for an item ─────────────────────────
// Points to the admin item detail page — scannable by phone camera
export function generateItemQRUrl(barcode: string): string {
  return `https://admin.avatisafestorage.com/admin/inventory?barcode=${encodeURIComponent(barcode)}`;
}

// ── Generate QR code URL for a warehouse location ─────────────
export function generateLocationQRUrl(location: string): string {
  return `https://admin.avatisafestorage.com/admin/warehouse?location=${encodeURIComponent(location)}`;
}

// ── QR code image URL (using Google Charts API — no external dep) ─
export function getQRImageUrl(data: string, size: number = 150): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

// ── Barcode image URL (Code128 via barcode.tec-it.com) ────────
// For label printing
export function getBarcodeImageUrl(barcode: string): string {
  return `https://barcode.tec-it.com/barcode.ashx?DATA=${encodeURIComponent(barcode)}&TYPE=Code128&VSYS=N&SYM=N`;
}

// ── Generate a unique item barcode from auto-incrementing IDs ─
export function autoBarcode(customerSeq: number, itemSeq: number): string {
  return `AVT-C${String(customerSeq).padStart(4, '0')}-I${String(itemSeq).padStart(4, '0')}`;
}
