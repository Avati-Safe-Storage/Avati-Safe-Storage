// ============================================================
//  Avati Safe Storage — Warehouse Map Utilities
//  Location format: {Warehouse}-{Row}-{Section}
//  Example: WH1-A-01
// ============================================================

import type { WarehouseLocation } from './inventoryTypes';

// ── Warehouse configuration ───────────────────────────────────
export const WAREHOUSES = ['WH1', 'WH2', 'WH3'] as const;
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const SECTIONS_PER_ROW = 20;

export type WarehouseId = typeof WAREHOUSES[number];
export type WarehouseRow = typeof ROWS[number];

// ── Parse a location string into its components ───────────────
export function parseLocation(locationStr: string): WarehouseLocation | null {
  const parts = locationStr.split('-');
  if (parts.length !== 3) return null;
  return {
    warehouse: parts[0],
    row:       parts[1],
    section:   parts[2],
  };
}

// ── Format components into a location string ──────────────────
export function formatLocation(loc: WarehouseLocation): string {
  const section = String(parseInt(loc.section)).padStart(2, '0');
  return `${loc.warehouse}-${loc.row}-${section}`;
}

// ── Generate all location strings for a warehouse ────────────
export function getAllLocations(warehouse: WarehouseId = 'WH1'): string[] {
  const locations: string[] = [];
  for (const row of ROWS) {
    for (let section = 1; section <= SECTIONS_PER_ROW; section++) {
      locations.push(formatLocation({ warehouse, row, section: String(section).padStart(2, '0') }));
    }
  }
  return locations;
}

// Total capacity per warehouse
export const CAPACITY_PER_WAREHOUSE = ROWS.length * SECTIONS_PER_ROW; // 120

// ── Generate a QR code URL for a location ────────────────────
// Points to the admin inventory lookup URL for that location
export function generateQRUrl(locationStr: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://admin.avatisafestorage.com';
  return `${baseUrl}/admin/warehouse?location=${encodeURIComponent(locationStr)}`;
}

// ── Adjacent location helpers ─────────────────────────────────
export function getAdjacentLocations(locationStr: string): string[] {
  const loc = parseLocation(locationStr);
  if (!loc) return [];

  const section = parseInt(loc.section);
  const rowIndex = ROWS.indexOf(loc.row as WarehouseRow);
  const adjacent: WarehouseLocation[] = [];

  // Previous/next section in same row
  if (section > 1)                   adjacent.push({ ...loc, section: String(section - 1).padStart(2, '0') });
  if (section < SECTIONS_PER_ROW)    adjacent.push({ ...loc, section: String(section + 1).padStart(2, '0') });
  // Adjacent rows
  if (rowIndex > 0)                  adjacent.push({ ...loc, row: ROWS[rowIndex - 1] });
  if (rowIndex < ROWS.length - 1)    adjacent.push({ ...loc, row: ROWS[rowIndex + 1] });

  return adjacent.map(formatLocation);
}

// ── Occupancy calculation ─────────────────────────────────────
export function calculateOccupancy(occupiedCount: number, warehouse?: WarehouseId): number {
  const capacity = warehouse ? CAPACITY_PER_WAREHOUSE : CAPACITY_PER_WAREHOUSE * WAREHOUSES.length;
  return Math.min(100, Math.round((occupiedCount / capacity) * 100));
}

// ── Sort locations ────────────────────────────────────────────
export function sortLocations(locations: string[]): string[] {
  return [...locations].sort((a, b) => {
    const la = parseLocation(a);
    const lb = parseLocation(b);
    if (!la || !lb) return 0;
    if (la.warehouse !== lb.warehouse) return la.warehouse.localeCompare(lb.warehouse);
    if (la.row !== lb.row) return la.row.localeCompare(lb.row);
    return parseInt(la.section) - parseInt(lb.section);
  });
}
