// ============================================================
//  Avati Safe Storage — Shared Inventory Item Definitions
//  Used by: Quote System (website) + Storage Setup (admin)
// ============================================================

export interface OptionConfig {
  label: string;
  isCheckbox?: boolean;
  choices?: string[];
}

export interface InventoryItemDef {
  id: string;
  name: string;
  room: string;
  options?: Record<string, OptionConfig>;
  calculatePrice: (opts: Record<string, string>) => number;
  calculatePacking: (opts: Record<string, string>) => number;
}

export const ITEM_ROOMS = [
  'Living Room', 'Bed Room', 'Kitchen and Dining',
  'Study Room', 'Utility and Storage', 'Boxes', 'Vehicles', 'Extra Items',
] as const;

export const STORAGE_TYPES = [
  'Household', 'Office', 'Business', 'Document', 'Vehicle', 'Mixed',
] as const;

export const PLANS = [
  { id: 'basic',        name: 'Silver Key (Basic)',        mult: 1.0, features: ['Standard secure storage', '24/7 CCTV Monitoring', 'Regular pest control'] },
  { id: 'premium',      name: 'Gold Key (Premium)',       mult: 1.3, popular: true, features: ['3-Layer Professional Packing', 'Climate controlled', 'Dust-free environment'] },
  { id: 'professional', name: 'Platinum Key (Pro)',  mult: 1.6, features: ['Wooden Vault Storage', 'Dedicated account manager', 'Insurance coverage up to 1L'] },
] as const;

export const WAREHOUSES = ['WH1', 'WH2', 'WH3'] as const;
export const WAREHOUSE_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const WAREHOUSE_SECTIONS = ['1', '2', '3', '4'] as const;

export const MIN_STORAGE_PRICE = 300;

export const BASE_ITEMS: InventoryItemDef[] = [
  // LIVING ROOM
  { id: 'sofa', name: 'Sofa', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['3 Seater', '2 Seater', '1 Seater'] } },
    calculatePrice: (o) => o.size === '3 Seater' ? 300 : o.size === '2 Seater' ? 200 : 100,
    calculatePacking: (o) => o.size === '3 Seater' ? 400 : o.size === '2 Seater' ? 300 : 150,
  },
  { id: 'center_table', name: 'Center Table', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] }, type: { label: 'Type', choices: ['Rectangle', 'Round'] }, glassMounted: { label: 'Glass Mounted', isCheckbox: true } },
    calculatePrice: (o) => (o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60) + (o.type === 'Round' ? 10 : 0) + (o.glassMounted === 'true' ? 20 : 0),
    calculatePacking: () => 150,
  },
  { id: 'tv_cabinet', name: 'TV Cabinet', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] }, type: { label: 'Type', choices: ['Floating Mount', 'Cabinet'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60,
    calculatePacking: () => 150,
  },
  { id: 'tv', name: 'TV', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['24"-32"', '32"-55"', '55"-65"', '65"+'] } },
    calculatePrice: (o) => o.size === '65"+' ? 180 : o.size === '55"-65"' ? 160 : o.size === '32"-55"' ? 140 : 120,
    calculatePacking: () => 200,
  },
  { id: 'ht', name: 'Home Theater / Soundbar', room: 'Living Room', calculatePrice: () => 60, calculatePacking: () => 100 },
  { id: 'pooja', name: 'Pooja Cabinet', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 130 : 100,
    calculatePacking: () => 150,
  },
  { id: 'shoe', name: 'Shoe Cabinet', room: 'Living Room',
    options: { size: { label: 'Size', choices: ['Small (metal, foldable)', 'Medium (1-2 columns)', 'Large (2-4 Columns)'] } },
    calculatePrice: (o) => o.size?.startsWith('Large') ? 130 : o.size?.startsWith('Medium') ? 100 : 50,
    calculatePacking: () => 100,
  },
  { id: 'inverter', name: 'Inverter', room: 'Living Room',
    options: { size: { label: 'Type', choices: ['Without battery', 'With 1 battery', 'With 2 battery'] } },
    calculatePrice: (o) => o.size?.includes('2') ? 100 : o.size?.includes('1') ? 80 : 60,
    calculatePacking: () => 100,
  },
  { id: 'bean_bag', name: 'Bean Bag', room: 'Living Room', calculatePrice: () => 60, calculatePacking: () => 50 },
  { id: 'photo', name: 'Photo Frames', room: 'Living Room', calculatePrice: () => 30, calculatePacking: () => 50 },

  // BEDROOM
  { id: 'cot', name: 'Cot Frame', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['Single', 'Double', 'Queen', 'King'] }, type: { label: 'Type', choices: ['Fully dismantlable (Engineered)', 'Partially dismantlable (only legs)', 'Foldable (Metal)'] } },
    calculatePrice: (o) => (o.size === 'King' ? 300 : o.size === 'Queen' ? 250 : o.size === 'Double' ? 220 : 150) + (o.type?.startsWith('Fully') ? 10 : 0),
    calculatePacking: () => 200,
  },
  { id: 'mattress', name: 'Mattress', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['Single', 'Double', 'Queen', 'King'] }, type: { label: 'Type', choices: ['Rollable', 'Non-Rollable'] } },
    calculatePrice: (o) => (o.size === 'King' ? 250 : o.size === 'Queen' ? 130 : o.size === 'Double' ? 120 : 80) + (o.type === 'Non-Rollable' ? 20 : 0),
    calculatePacking: () => 150,
  },
  { id: 'bed_table', name: 'Bedside Table', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60,
    calculatePacking: () => 50,
  },
  { id: 'dressing', name: 'Dressing Table', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['Small (1 column)', 'Medium (2 columns)', 'Large (3 Columns)'] } },
    calculatePrice: (o) => o.size?.startsWith('Large') ? 150 : o.size?.startsWith('Medium') ? 130 : 120,
    calculatePacking: () => 150,
  },
  { id: 'mirror', name: 'Full Length Mirror', room: 'Bed Room', calculatePrice: () => 60, calculatePacking: () => 100 },
  { id: 'ac', name: 'Air Conditioner', room: 'Bed Room',
    options: { type: { label: 'Type', choices: ['Split AC', 'Window AC'] } },
    calculatePrice: (o) => o.type === 'Split AC' ? 150 : 130,
    calculatePacking: () => 150,
  },
  { id: 'cooler', name: 'Air Cooler', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : 90,
    calculatePacking: () => 100,
  },
  { id: 'fan', name: 'Fan', room: 'Bed Room',
    options: { type: { label: 'Type', choices: ['Table', 'Pedestal', 'Wall-Mount'] } },
    calculatePrice: (o) => o.type === 'Pedestal' ? 80 : 60,
    calculatePacking: () => 50,
  },
  { id: 'wardrobe', name: 'Wardrobe', room: 'Bed Room',
    options: { size: { label: 'Size', choices: ['2 Door', '3 Door', '4 Door', 'Walk-in'] } },
    calculatePrice: (o) => o.size === 'Walk-in' ? 500 : o.size === '4 Door' ? 350 : o.size === '3 Door' ? 250 : 180,
    calculatePacking: () => 300,
  },

  // KITCHEN AND DINING
  { id: 'fridge', name: 'Refrigerator', room: 'Kitchen and Dining',
    options: { type: { label: 'Type', choices: ['Single Door', 'Double Door', 'Side by Side'] } },
    calculatePrice: (o) => o.type === 'Side by Side' ? 200 : o.type === 'Double Door' ? 180 : 150,
    calculatePacking: () => 300,
  },
  { id: 'dining', name: 'Dining Table', room: 'Kitchen and Dining',
    options: { seats: { label: 'Seats', choices: ['4 Seater', '6 Seater', '8 Seater'] }, type: { label: 'Top Type', choices: ['Round', 'Square'] }, glassMounted: { label: 'Glass Top', isCheckbox: true } },
    calculatePrice: (o) => o.seats === '8 Seater' ? 500 : o.seats === '6 Seater' ? 300 : 200,
    calculatePacking: () => 200,
  },
  { id: 'dw', name: 'Dishwasher', room: 'Kitchen and Dining', calculatePrice: () => 150, calculatePacking: () => 150 },
  { id: 'mw', name: 'Microwave / OTG Oven', room: 'Kitchen and Dining', calculatePrice: () => 70, calculatePacking: () => 100 },
  { id: 'pantry', name: 'Pantry Cabinet', room: 'Kitchen and Dining',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 100 : 80,
    calculatePacking: () => 150,
  },
  { id: 'stove', name: 'Gas Stove', room: 'Kitchen and Dining',
    options: { size: { label: 'Burners', choices: ['1-2 Burner', '2-4 Burner'] } },
    calculatePrice: (o) => o.size === '2-4 Burner' ? 90 : 70,
    calculatePacking: () => 50,
  },
  { id: 'cylinder', name: 'Gas Cylinder', room: 'Kitchen and Dining', calculatePrice: () => 70, calculatePacking: () => 50 },
  { id: 'purifier', name: 'Water Purifier', room: 'Kitchen and Dining', calculatePrice: () => 60, calculatePacking: () => 50 },

  // STUDY ROOM
  { id: 'desk', name: 'Desk / Table', room: 'Study Room',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 100 : 80,
    calculatePacking: () => 150,
  },
  { id: 'chair', name: 'Chair', room: 'Study Room',
    options: { type: { label: 'Type', choices: ['Office', 'Plastic (Stackable)', 'Plastic', 'Metal'] } },
    calculatePrice: (o) => o.type === 'Office' ? 100 : o.type === 'Metal' ? 40 : o.type === 'Plastic' ? 35 : 30,
    calculatePacking: () => 50,
  },
  { id: 'monitor', name: 'Monitor', room: 'Study Room',
    options: { size: { label: 'Size', choices: ['24"-32"', '32"+'] } },
    calculatePrice: (o) => o.size === '32"+' ? 150 : 120,
    calculatePacking: () => 100,
  },
  { id: 'printer', name: 'Printer', room: 'Study Room', calculatePrice: () => 80, calculatePacking: () => 80 },
  { id: 'bookshelf', name: 'Bookshelf', room: 'Study Room',
    options: { size: { label: 'Size', choices: ['Small (2 shelves)', 'Medium (4 shelves)', 'Large (6+ shelves)'] } },
    calculatePrice: (o) => o.size?.startsWith('Large') ? 150 : o.size?.startsWith('Medium') ? 100 : 70,
    calculatePacking: () => 100,
  },

  // UTILITY AND STORAGE
  { id: 'wm', name: 'Washing Machine', room: 'Utility and Storage',
    options: { type: { label: 'Type', choices: ['Top Load', 'Front Load'] } },
    calculatePrice: (o) => o.type === 'Front Load' ? 150 : 130,
    calculatePacking: () => 150,
  },
  { id: 'vacuum', name: 'Vacuum Cleaner', room: 'Utility and Storage', calculatePrice: () => 60, calculatePacking: () => 50 },
  { id: 'luggage', name: 'Luggage Bags', room: 'Utility and Storage',
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 70 : 50,
    calculatePacking: () => 30,
  },
  { id: 'gunny', name: 'Gunny Bags', room: 'Utility and Storage',
    options: { size: { label: 'Size', choices: ['Large (25 Kg)', 'Extra Large (50 Kg)'] } },
    calculatePrice: (o) => o.size?.startsWith('Extra') ? 100 : 60,
    calculatePacking: () => 30,
  },
  { id: 'ladder', name: 'Ladder', room: 'Utility and Storage', calculatePrice: () => 100, calculatePacking: () => 50 },
  { id: 'ironing', name: 'Ironing Stand', room: 'Utility and Storage', calculatePrice: () => 60, calculatePacking: () => 30 },
  { id: 'bucket', name: 'Buckets / Tubs / Bins', room: 'Utility and Storage', calculatePrice: () => 50, calculatePacking: () => 20 },
  { id: 'drum', name: 'Drum', room: 'Utility and Storage',
    options: { size: { label: 'Size', choices: ['Small (Below 100 ltrs)', 'Large (Above 100 ltrs)'] } },
    calculatePrice: (o) => o.size?.startsWith('Large') ? 150 : 100,
    calculatePacking: () => 30,
  },

  // BOXES
  { id: 'box', name: 'Storage Box', room: 'Boxes',
    options: { size: { label: 'Size', choices: ['Small', 'Medium (Avati Standard)', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 80 : o.size?.startsWith('Medium') ? 60 : 50,
    calculatePacking: () => 20,
  },

  // VEHICLES
  { id: 'kids_cycle', name: 'Kids Cycle', room: 'Vehicles', calculatePrice: () => 100, calculatePacking: () => 50 },
  { id: 'cycle', name: 'Bicycle', room: 'Vehicles', calculatePrice: () => 150, calculatePacking: () => 100 },
  { id: 'scooter', name: 'Scooter / Two-Wheeler', room: 'Vehicles', calculatePrice: () => 500, calculatePacking: () => 200 },
];

// ─── Helpers ──────────────────────────────────────────────────

export function getItemById(id: string): InventoryItemDef | undefined {
  return BASE_ITEMS.find(i => i.id === id);
}

export function getItemsByRoom(room: string): InventoryItemDef[] {
  return BASE_ITEMS.filter(i => i.room === room);
}

export function calculateCosts(
  instances: { itemId: string; options: Record<string, string>; quantity: number }[],
  planId: string,
  transportRequired: boolean,
  distanceKm: number,
  packingRequired: boolean,
  liftSurchargeFloors: number,
) {
  let rawStorage = 0;
  let rawPacking = 0;

  instances.forEach(inst => {
    const def = getItemById(inst.itemId);
    if (def) {
      rawStorage += def.calculatePrice(inst.options) * inst.quantity;
      rawPacking += def.calculatePacking(inst.options) * inst.quantity;
    }
  });

  const baseStorage = Math.max(rawStorage, instances.length > 0 ? MIN_STORAGE_PRICE : 0);
  const planMult = PLANS.find(p => p.id === planId)?.mult || 1.0;
  const monthlyStorage = baseStorage * planMult;

  const packingCost = packingRequired ? rawPacking : 0;
  const transportCost = transportRequired ? 1500 + distanceKm * 50 : 0;
  const liftSurcharge = liftSurchargeFloors > 0 ? liftSurchargeFloors * 300 : 0;

  const oneTime = packingCost + transportCost + liftSurcharge;
  const subtotal = monthlyStorage + oneTime;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return { monthlyStorage, packingCost, transportCost, liftSurcharge, oneTime, subtotal, gst, total };
}

/**
 * Calculates prorated first-month charge.
 * From pickup date → 5th of the following month.
 */
export function calculateProration(pickupDate: string, monthlyRate: number): {
  days: number;
  daysInMonth: number;
  proratedAmount: number;
  nextBillingDate: string;
} {
  const pickup = new Date(pickupDate);
  const nextMonth = new Date(pickup.getFullYear(), pickup.getMonth() + 1, 5);
  const daysInMonth = new Date(pickup.getFullYear(), pickup.getMonth() + 1, 0).getDate();
  const days = Math.ceil((nextMonth.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
  const proratedAmount = Math.round((monthlyRate / daysInMonth) * days);
  return {
    days,
    daysInMonth,
    proratedAmount,
    nextBillingDate: nextMonth.toISOString().split('T')[0],
  };
}
