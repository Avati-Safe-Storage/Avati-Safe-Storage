// ============================================================
//  Avati Safe Storage — Complete Data Layer v3.0
//  All types, API functions, and mock data for the full
//  customer journey: Lead → Customer → Pickup → Storage → Items → Billing
// ============================================================

export const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'YOUR_APPS_SCRIPT_URL_HERE';
export const SHEET_ID   = import.meta.env.VITE_SHEET_ID || 'YOUR_SHEET_ID_HERE';

function isConfigured() {
  return SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE' && SHEET_ID !== 'YOUR_SHEET_ID_HERE';
}

export function getSheetsConfig() {
  return { configured: isConfigured(), scriptUrl: SCRIPT_URL, sheetId: SHEET_ID };
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────

async function apiPost(payload: Record<string, unknown>): Promise<any> {
  if (!isConfigured()) throw new Error('Google Sheets not configured');
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, sheetId: SHEET_ID }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiGet(params: Record<string, string>): Promise<any> {
  if (!isConfigured()) throw new Error('Google Sheets not configured');
  const url = new URL(SCRIPT_URL);
  url.searchParams.set('sheetId', SHEET_ID);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── TYPES ─────────────────────────────────────────────────────────────────

// ── Lead ──────────────────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Converted' | 'Lost';

export interface Lead {
  id: string;                 // AVT-LEAD-0001
  name: string;
  phone: string;
  email: string;
  storageType: string;
  plan: string;
  area: string;
  pickupDate?: string;
  duration?: number;
  packingRequired?: boolean;
  transportRequired?: boolean;
  distance?: number;
  liftAvailable?: string;
  floors?: number;
  inventoryJson?: string;     // JSON of InventoryInstance[]
  monthlyEstimate?: number;
  totalEstimate?: number;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  convertedCustomerId?: string;
}

// ── Customer ───────────────────────────────────────────────────────────────
export type CustomerStatus =
  | 'Onboarding' | 'Pickup Scheduled' | 'Pickup In Progress'
  | 'Pickup Completed' | 'Storage Setup' | 'Stored' | 'Active' | 'Inactive';

export type KycType = 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License' | 'GSTIN';

export interface Customer {
  id: string;                 // AVT-CUS-0001
  leadId?: string;
  name: string;
  company?: string;
  phone: string;
  altPhone?: string;
  email: string;
  kycType: KycType;
  kycId: string;
  gstin?: string;
  startDate: string;
  insuranceRequired: boolean;
  status: CustomerStatus;
  // Portal login
  loginId: string;            // avt.rahul@avati.in
  password: string;           // stored as plain-text for now (show once)
  // References
  driveFolder?: string;
  pickupId?: string;
  storageId?: string;
  notes?: string;
  createdAt: string;
  storageUnit?: string;
  monthlyRate?: number;
  items?: number;
  onboardingDate?: string;
  alternateNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// ── Pickup ─────────────────────────────────────────────────────────────────
export type PickupStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
export type PreferredTime = 'Morning (9am–12pm)' | 'Afternoon (12pm–4pm)' | 'Evening (4pm–7pm)';

export interface Pickup {
  id: string;                 // AVT-PKP-0001
  customerId: string;
  customerName?: string;
  address: string;
  floor: string;
  liftAvailable: boolean;
  pickupDate: string;
  preferredTime: PreferredTime;
  advanceAmount: number;
  advancePaymentId?: string;  // AVT-PAY-0001
  staffNames?: string;        // comma-separated staff names
  vehicleNumber?: string;
  labours?: string;
  status: PickupStatus;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

// ── Storage ────────────────────────────────────────────────────────────────
export type StorageStatus = 'Active' | 'Vacating' | 'Vacated';
export type StoragePlan = 'basic' | 'premium' | 'professional';
export type StorageType = 'Household' | 'Office' | 'Business' | 'Document' | 'Vehicle' | 'Mixed';

export interface Storage {
  id: string;                 // AVT-STO-0001
  customerId: string;
  customerName?: string;
  warehouse: string;          // WH1, WH2, WH3
  row: string;                // A–F
  section: string;            // 1–4
  location: string;           // WH1-A-01
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

// ── Stored Item ────────────────────────────────────────────────────────────
export type ItemCondition = 'Excellent' | 'Good' | 'Fair' | 'Damaged';
export type ItemStatus = 'In Storage' | 'Retrieval Requested' | 'Retrieved';

export interface StoredItem {
  id: string;                 // AVT-ITEM-0001 (resets per customer)
  customerId: string;
  storageId: string;
  itemDefId?: string;         // links to BASE_ITEMS id
  name: string;
  category: string;           // room category
  description?: string;
  options?: string;           // JSON of selected options
  quantity: number;
  unit?: string;
  condition: ItemCondition;
  photoUrls?: string;         // comma-separated Drive URLs
  isExtra?: boolean;          // true if not in standard catalogue
  status: ItemStatus;
  notes?: string;
  addedAt: string;
  isFragile?: boolean;
  requiresClimate?: boolean;
  customerName?: string;
  zone?: string;
  rack?: string;
  dateAdded?: string;
}

// ── Payment ────────────────────────────────────────────────────────────────
export type PaymentType = 'Advance' | 'Transportation' | 'Packing' | 'Monthly Storage' | 'Insurance' | 'Miscellaneous';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Waived';

export interface Payment {
  id: string;                 // AVT-PAY-0001
  customerId: string;
  type: PaymentType;
  amount: number;
  gstAmount?: number;
  totalAmount: number;
  paidOn?: string;
  dueDate?: string;
  status: PaymentStatus;
  description: string;
  invoiceUrl?: string;        // Drive URL
  billingPeriod?: string;     // e.g., "2024-02-05 to 2024-03-05"
  createdAt: string;
}

// ── Staff ──────────────────────────────────────────────────────────────────
export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string;
  vehicleNumber?: string;
  available: boolean;
}

// ─── LEADS API ─────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  try { return await apiGet({ action: 'getLeads' }); }
  catch { return getMockLeads(); }
}

export async function addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addLead', data: lead });
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'updateLeadStatus', id, status, notes }).then(r => r.success);
}

// ─── CUSTOMERS API ─────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  try { return await apiGet({ action: 'getCustomers' }); }
  catch { return getMockCustomers(); }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const all = await getCustomers();
  return all.find(c => c.id === id) || null;
}

export async function addCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; driveUrl?: string }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addCustomer', data });
}

export async function updateCustomer(data: Partial<Customer> & { id: string }): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'updateCustomer', data }).then(r => r.success);
}

export async function deleteCustomer(id: string): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'deleteCustomer', id }).then(r => r.success);
}

// ─── PICKUPS API ───────────────────────────────────────────────────────────

export async function getPickups(): Promise<Pickup[]> {
  try { return await apiGet({ action: 'getPickups' }); }
  catch { return getMockPickups(); }
}

export async function addPickup(data: Omit<Pickup, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addPickup', data });
}

export async function updatePickup(data: Partial<Pickup> & { id: string }): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'updatePickup', data }).then(r => r.success);
}

export async function completePickup(pickupId: string, customerId: string): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'completePickup', pickupId, customerId }).then(r => r.success);
}

// ─── STORAGE API ───────────────────────────────────────────────────────────

export async function getStorageList(): Promise<Storage[]> {
  try { return await apiGet({ action: 'getStorage' }); }
  catch { return getMockStorage(); }
}

export async function addStorage(data: Omit<Storage, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addStorage', data });
}

export async function updateStorage(data: Partial<Storage> & { id: string }): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'updateStorage', data }).then(r => r.success);
}

// ─── ITEMS API ─────────────────────────────────────────────────────────────

export async function getStoredItems(storageId?: string): Promise<StoredItem[]> {
  try {
    const params: any = { action: 'getItems' };
    if (storageId) params.storageId = storageId;
    return await apiGet(params);
  } catch { return getMockItems(); }
}

export async function addStoredItems(items: Omit<StoredItem, 'id' | 'addedAt'>[]): Promise<{ success: boolean; ids?: string[] }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addItems', items });
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<boolean> {
  if (!isConfigured()) return false;
  return apiPost({ action: 'updateItemStatus', id, status }).then(r => r.success);
}

// ─── PAYMENTS API ──────────────────────────────────────────────────────────

export async function getPayments(customerId?: string): Promise<Payment[]> {
  try {
    const params: any = { action: 'getPayments' };
    if (customerId) params.customerId = customerId;
    return await apiGet(params);
  } catch { return getMockPayments(); }
}

export async function addPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; invoiceUrl?: string }> {
  if (!isConfigured()) return { success: false };
  return apiPost({ action: 'addPayment', data });
}

// ─── STAFF API ─────────────────────────────────────────────────────────────

export async function getStaff(): Promise<Staff[]> {
  try { return await apiGet({ action: 'getStaff' }); }
  catch { return getMockStaff(); }
}

// ─── PORTAL API ────────────────────────────────────────────────────────────

export interface CustomerPortalData {
  customer: Customer;
  pickup?: Pickup;
  storage?: Storage;
  items: StoredItem[];
  payments: Payment[];
}

export async function getPortalData(customerId: string): Promise<CustomerPortalData | null> {
  try { return await apiGet({ action: 'getPortalData', customerId }); }
  catch { return null; }
}

export async function validatePortalLogin(loginId: string, password: string): Promise<Customer | null> {
  try {
    const result = await apiPost({ action: 'validateLogin', loginId, password });
    return result.success ? result.customer : null;
  } catch { return null; }
}

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────

export interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  activeItems: number;
  occupancy: number;
  monthlyRevenue: string;
  pendingPickups: number;
  newLeadsToday: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try { return await apiGet({ action: 'getStats' }); }
  catch {
    return { totalLeads: 24, totalCustomers: 18, activeItems: 1247, occupancy: 78, monthlyRevenue: '₹4.2M', pendingPickups: 3, newLeadsToday: 2 };
  }
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────

function getMockLeads(): Lead[] {
  return [
    { id: 'AVT-LEAD-0001', name: 'Arun Kumar', phone: '+91 98765 43210', email: 'arun@email.com', storageType: 'Household', plan: 'premium', area: 'Whitefield', pickupDate: '2024-02-15', duration: 6, packingRequired: true, transportRequired: true, distance: 15, monthlyEstimate: 4500, totalEstimate: 9850, status: 'Quotation Sent', createdAt: '2024-01-20T10:30:00Z' },
    { id: 'AVT-LEAD-0002', name: 'Sneha Reddy', phone: '+91 87654 32109', email: 'sneha@company.com', storageType: 'Office', plan: 'professional', area: 'Koramangala', pickupDate: '2024-02-20', duration: 12, packingRequired: false, transportRequired: true, distance: 12, monthlyEstimate: 8200, totalEstimate: 15400, status: 'New', createdAt: '2024-01-22T14:00:00Z' },
    { id: 'AVT-LEAD-0003', name: 'Vikram Joshi', phone: '+91 76543 21098', email: 'vikram@biz.in', storageType: 'Business', plan: 'basic', area: 'HSR Layout', status: 'Converted', convertedCustomerId: 'AVT-CUS-0001', createdAt: '2024-01-10T09:00:00Z' },
  ];
}

function getMockCustomers(): Customer[] {
  return [
    { id: 'AVT-CUS-0001', leadId: 'AVT-LEAD-0003', name: 'Rahul Mehta', company: 'Acme Corp', phone: '+91 98765 43210', email: 'rahul@acme.com', kycType: 'PAN', kycId: 'ABCPM1234D', gstin: '29ABCPM1234D1ZK', startDate: '2024-01-15', insuranceRequired: true, status: 'Stored', loginId: 'avt.rahul@avati.in', password: 'Avt@1234', pickupId: 'AVT-PKP-0001', storageId: 'AVT-STO-0001', createdAt: '2024-01-15T10:00:00Z' },
    { id: 'AVT-CUS-0002', name: 'Priya Sharma', company: 'Global Tech', phone: '+91 87654 32109', email: 'priya@globaltech.in', kycType: 'Aadhaar', kycId: '1234-5678-9012', startDate: '2024-02-01', insuranceRequired: false, status: 'Pickup Scheduled', loginId: 'avt.priya@avati.in', password: 'Avt@5678', pickupId: 'AVT-PKP-0002', createdAt: '2024-02-01T10:00:00Z' },
  ];
}

function getMockPickups(): Pickup[] {
  return [
    { id: 'AVT-PKP-0001', customerId: 'AVT-CUS-0001', customerName: 'Rahul Mehta', address: '42 MG Road, Bengaluru', floor: '3rd Floor', liftAvailable: true, pickupDate: '2024-01-15', preferredTime: 'Morning (9am–12pm)', advanceAmount: 2000, advancePaymentId: 'AVT-PAY-0001', staffNames: 'Suresh Kumar, Ravi Das', vehicleNumber: 'KA-01-AB-1234', labours: '2', status: 'Completed', completedAt: '2024-01-15', createdAt: '2024-01-12T10:00:00Z' },
    { id: 'AVT-PKP-0002', customerId: 'AVT-CUS-0002', customerName: 'Priya Sharma', address: '8 Koramangala 4th Block, Bengaluru', floor: '1st Floor', liftAvailable: false, pickupDate: '2024-02-10', preferredTime: 'Afternoon (12pm–4pm)', advanceAmount: 3000, status: 'Scheduled', createdAt: '2024-02-03T10:00:00Z' },
  ];
}

function getMockStorage(): Storage[] {
  return [
    { id: 'AVT-STO-0001', customerId: 'AVT-CUS-0001', customerName: 'Rahul Mehta', warehouse: 'WH1', row: 'A', section: '1', location: 'WH1-A-01', plan: 'premium', storageType: 'Household', insuranceOpted: true, startDate: '2024-01-15', itemCount: 24, monthlyRate: 4500, status: 'Active', createdAt: '2024-01-15T14:00:00Z' },
  ];
}

function getMockItems(): StoredItem[] {
  return [
    { id: 'AVT-ITEM-0001', customerId: 'AVT-CUS-0001', storageId: 'AVT-STO-0001', itemDefId: 'sofa', name: 'Sofa', category: 'Living Room', options: '{"size":"3 Seater"}', quantity: 1, unit: 'unit', condition: 'Good', status: 'In Storage', addedAt: '2024-01-15' },
    { id: 'AVT-ITEM-0002', customerId: 'AVT-CUS-0001', storageId: 'AVT-STO-0001', itemDefId: 'tv', name: 'TV', category: 'Living Room', options: '{"size":"32\\"-55\\""}', quantity: 1, unit: 'unit', condition: 'Excellent', status: 'In Storage', addedAt: '2024-01-15' },
    { id: 'AVT-ITEM-0003', customerId: 'AVT-CUS-0001', storageId: 'AVT-STO-0001', itemDefId: 'cot', name: 'Cot Frame', category: 'Bed Room', quantity: 1, unit: 'unit', condition: 'Good', status: 'In Storage', addedAt: '2024-01-15' },
    { id: 'AVT-ITEM-0004', customerId: 'AVT-CUS-0001', storageId: 'AVT-STO-0001', itemDefId: 'fridge', name: 'Refrigerator', category: 'Kitchen and Dining', options: '{"type":"Double Door"}', quantity: 1, unit: 'unit', condition: 'Excellent', status: 'In Storage', addedAt: '2024-01-15' },
  ];
}

function getMockPayments(): Payment[] {
  return [
    { id: 'AVT-PAY-0001', customerId: 'AVT-CUS-0001', type: 'Advance', amount: 2000, gstAmount: 0, totalAmount: 2000, paidOn: '2024-01-12', status: 'Paid', description: 'Advance payment at pickup booking', createdAt: '2024-01-12T10:00:00Z' },
    { id: 'AVT-PAY-0002', customerId: 'AVT-CUS-0001', type: 'Transportation', amount: 2250, gstAmount: 405, totalAmount: 2655, paidOn: '2024-01-16', status: 'Paid', description: 'Transportation charges (15km)', createdAt: '2024-01-16T10:00:00Z' },
    { id: 'AVT-PAY-0003', customerId: 'AVT-CUS-0001', type: 'Monthly Storage', amount: 4500, gstAmount: 810, totalAmount: 5310, dueDate: '2024-02-05', status: 'Paid', description: 'Monthly storage: Jan 15 – Feb 5 (prorated 21 days)', billingPeriod: '2024-01-15 to 2024-02-05', createdAt: '2024-01-16T10:00:00Z' },
    { id: 'AVT-PAY-0004', customerId: 'AVT-CUS-0001', type: 'Monthly Storage', amount: 4500, gstAmount: 810, totalAmount: 5310, dueDate: '2024-03-05', status: 'Pending', description: 'Monthly storage: Feb 5 – Mar 5', billingPeriod: '2024-02-05 to 2024-03-05', createdAt: '2024-02-05T10:00:00Z' },
  ];
}

function getMockStaff(): Staff[] {
  return [
    { id: 'STF-001', name: 'Suresh Kumar', phone: '+91 98111 22333', role: 'Supervisor', vehicleNumber: 'KA-01-AB-1234', available: true },
    { id: 'STF-002', name: 'Ravi Das', phone: '+91 87222 33444', role: 'Labour', available: true },
    { id: 'STF-003', name: 'Mohan Singh', phone: '+91 76333 44555', role: 'Labour', vehicleNumber: 'KA-05-CD-5678', available: false },
  ];
}
