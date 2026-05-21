// ============================================================
//  Avati Safe Storage — Inventory & Warehouse Data Models
//  Canonical types for the full inventory system.
//  Shared between main site, admin panel, and portal.
// ============================================================

// ── Warehouse Location Format ─────────────────────────────────
// Format: {Warehouse}-{Row}-{Section}
// Example: WH1-A-01
// WH1–WH3: warehouse units; A–F: rows; 01–20: sections per row

export interface WarehouseLocation {
  warehouse: 'WH1' | 'WH2' | 'WH3' | string;
  row: string;        // A–F
  section: string;    // '01'–'20'
}

// ── Core Entity IDs ───────────────────────────────────────────
export type CustomerID = `AVT-CUS-${string}`;
export type StorageID  = `AVT-STO-${string}`;
export type ItemID     = `AVT-ITEM-${string}`;
export type PickupID   = `AVT-PKP-${string}`;
export type PaymentID  = `AVT-PAY-${string}`;

// ── Item Condition ────────────────────────────────────────────
export type ItemCondition = 'Excellent' | 'Good' | 'Fair' | 'Damaged';

// ── Retrieval Status ──────────────────────────────────────────
export type RetrievalStatus =
  | 'In Storage'
  | 'Retrieval Requested'
  | 'Out for Delivery'
  | 'Retrieved';

// ── Stored Item ───────────────────────────────────────────────
export interface StoredItem {
  id: ItemID;
  customerId: CustomerID;
  storageId: StorageID;
  // Catalogue reference
  itemDefId?: string;         // links to BASE_ITEMS id in QuotationSystem
  name: string;
  category: string;           // "Living Room", "Bed Room", etc.
  description?: string;
  options?: string;           // JSON string of selected options
  quantity: number;
  unit?: string;
  condition: ItemCondition;
  // Physical attributes
  isFragile?: boolean;
  requiresClimate?: boolean;
  // Media
  photoUrls?: string[];       // Zoho WorkDrive URLs
  // Warehouse location
  warehouseLocation?: string; // e.g. "WH1-A-01"
  barcode?: string;           // barcode / QR code identifier
  // Lifecycle
  status: RetrievalStatus;
  addedAt: string;            // ISO date
  retrievedAt?: string;       // ISO date
  notes?: string;
  // Flags
  isExtra?: boolean;          // true if not in standard catalogue
}

// ── Retrieval Request ─────────────────────────────────────────
export interface RetrievalRequest {
  id: string;
  customerId: CustomerID;
  storageId: StorageID;
  itemIds: ItemID[];
  dropDate: string;           // ISO date
  dropAddress: string;
  floor?: number;
  liftAvailable?: boolean;
  preferredTime?: string;
  status: 'Pending' | 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

// ── Storage Unit ──────────────────────────────────────────────
export type StoragePlan = 'basic' | 'premium' | 'professional';
export type StorageStatus = 'Active' | 'Vacating' | 'Vacated';
export type StorageType = 'Household' | 'Office' | 'Business' | 'Document' | 'Vehicle' | 'Mixed';

export interface StorageUnit {
  id: StorageID;
  customerId: CustomerID;
  customerName?: string;
  location: string;           // "WH1-A-01"
  plan: StoragePlan;
  storageType: StorageType;
  insuranceOpted: boolean;
  startDate: string;
  itemCount: number;
  monthlyRate: number;
  status: StorageStatus;
  notes?: string;
  createdAt: string;
}
