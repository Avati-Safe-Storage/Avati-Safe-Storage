// ============================================================
//  avati-enterprise — Role-Based Access Control Service
//  Defines roles, permissions, and access guard utilities.
// ============================================================

export type UserRole =
  | 'super_admin'           // Full access — Avati owner
  | 'warehouse_supervisor'  // Can manage inventory, pickups, retrievals
  | 'staff'                 // Can view customers, log pickups
  | 'client';               // Customer portal access only

export const PERMISSIONS = {
  // Leads
  VIEW_LEADS:     ['super_admin', 'warehouse_supervisor', 'staff'],
  MANAGE_LEADS:   ['super_admin', 'warehouse_supervisor'],
  // Customers
  VIEW_CUSTOMERS: ['super_admin', 'warehouse_supervisor', 'staff'],
  MANAGE_CUSTOMERS: ['super_admin'],
  // Inventory & Storage
  VIEW_INVENTORY: ['super_admin', 'warehouse_supervisor', 'staff'],
  MANAGE_INVENTORY: ['super_admin', 'warehouse_supervisor'],
  // Pickups
  VIEW_PICKUPS:   ['super_admin', 'warehouse_supervisor', 'staff'],
  MANAGE_PICKUPS: ['super_admin', 'warehouse_supervisor'],
  // Payments & Invoices
  VIEW_PAYMENTS:  ['super_admin', 'warehouse_supervisor'],
  MANAGE_PAYMENTS:['super_admin'],
  // Billing & Invoices
  VIEW_INVOICES:  ['super_admin', 'warehouse_supervisor'],
  CREATE_INVOICES:['super_admin'],
  // Reports
  VIEW_REPORTS:   ['super_admin', 'warehouse_supervisor'],
  // CMS (Blog, Pricing)
  MANAGE_CMS:     ['super_admin'],
  // Settings
  MANAGE_SETTINGS:['super_admin'],
  // Portal (client-only)
  VIEW_OWN_STORAGE: ['client'],
  REQUEST_RETRIEVAL: ['client'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function requireRole(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Access denied: ${role} cannot ${permission}`);
  }
}

// ── Admin user type ───────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// ── Session storage for admin auth ────────────────────────────
const SESSION_KEY = 'avati_admin_session';

export function getAdminSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
