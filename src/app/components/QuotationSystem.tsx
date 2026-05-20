import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../App";

function useStickyState<T>(defaultValue: T | (() => T), key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue !== null) {
        return JSON.parse(stickyValue);
      }
    } catch (e) {}
    return typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue;
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}
import {
  MapPin, ChevronRight, Minus, Plus, Check, Home, Building, Briefcase, FileText, Car, Trash2,
  Tv, Bed, Utensils, BookOpen, Archive, Sofa, Table, Box, Speaker, BatteryCharging,
  Image as ImageIcon, Sparkles, PanelRight, Wind, Snowflake, Fan, Refrigerator, Microwave,
  Flame, Cylinder, Droplet, Armchair, Monitor, Printer, WashingMachine, ShoppingBag,
  AlignJustify, PaintBucket, Footprints, Church, Square, BedSingle, Package, Download, ChevronDown, X, Bike, RotateCcw,
  Zap, Camera, Video
} from "lucide-react";

type OptionConfig = {
  label: string;
  isCheckbox?: boolean;
  choices?: string[];
};

interface BaseItem {
  id: string;
  name: string;
  room: string;
  icon: any;
  options?: Record<string, OptionConfig>;
  calculatePrice: (opts: Record<string, string>) => number;
  calculatePacking: (opts: Record<string, string>) => number;
}

const BASE_ITEMS: BaseItem[] = [
  // LIVING ROOM
  {
    id: 'sofa', name: 'Sofa', room: 'Living Room', icon: Sofa,
    options: { size: { label: 'Size', choices: ['3 Seater', '2 Seater', '1 Seater'] } },
    calculatePrice: (o) => o.size === '3 Seater' ? 300 : o.size === '2 Seater' ? 200 : 100,
    calculatePacking: (o) => o.size === '3 Seater' ? 400 : o.size === '2 Seater' ? 300 : 150
  },
  {
    id: 'center_table', name: 'Center Table', room: 'Living Room', icon: Table,
    options: {
      size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] },
      type: { label: 'Type', choices: ['Rectangle', 'Round'] },
      glassMounted: { label: 'Glass Mounted', isCheckbox: true }
    },
    calculatePrice: (o) => {
      let base = o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60;
      let typeAdd = o.type === 'Round' ? 10 : 0;
      let glassAdd = o.glassMounted === 'true' ? 20 : 0;
      return base + typeAdd + glassAdd;
    },
    calculatePacking: () => 150
  },
  {
    id: 'tv_cabinet', name: 'TV Cabinet', room: 'Living Room', icon: Box,
    options: {
      size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] },
      type: { label: 'Type', choices: ['Floating Mount', 'Cabinet'] }
    },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60,
    calculatePacking: () => 150
  },
  {
    id: 'tv', name: 'TV', room: 'Living Room', icon: Tv,
    options: { size: { label: 'Size', choices: ['24"-32"', '32"-55"', '55"-65"', '65"+'] } },
    calculatePrice: (o) => o.size === '65"+' ? 180 : o.size === '55"-65"' ? 160 : o.size === '32"-55"' ? 140 : 120,
    calculatePacking: () => 200
  },
  { id: 'ht', name: 'Home theater/Soundbar', room: 'Living Room', icon: Speaker, calculatePrice: () => 60, calculatePacking: () => 100 },
  {
    id: 'pooja', name: 'Pooja Cabinet', room: 'Living Room', icon: Church,
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 130 : 100,
    calculatePacking: () => 150
  },
  {
    id: 'shoe', name: 'Shoe Cabinet', room: 'Living Room', icon: Footprints,
    options: { size: { label: 'Size', choices: ['Small(metal, foldable)', 'Medium(1-2 columns)', 'Large(2-4 Columns)'] } },
    calculatePrice: (o) => o.size === 'Large(2-4 Columns)' ? 130 : o.size === 'Medium(1-2 columns)' ? 100 : 50,
    calculatePacking: () => 100
  },
  {
    id: 'inverter', name: 'Inverter', room: 'Living Room', icon: BatteryCharging,
    options: { size: { label: 'Type', choices: ['Without battery', 'with 1 battery', 'with 2 battery'] } },
    calculatePrice: (o) => o.size === 'with 2 battery' ? 100 : o.size === 'with 1 battery' ? 80 : 60,
    calculatePacking: () => 100
  },
  { id: 'bean_bag', name: 'Bean Bag', room: 'Living Room', icon: Armchair, calculatePrice: () => 60, calculatePacking: () => 50 },
  { id: 'photo', name: 'Photo frames', room: 'Living Room', icon: ImageIcon, calculatePrice: () => 30, calculatePacking: () => 50 },

  // BED ROOM
  {
    id: 'cot', name: 'Cot frame', room: 'Bed Room', icon: Bed,
    options: {
      size: { label: 'Size', choices: ['Single', 'Double', 'Queen', 'King'] },
      type: { label: 'Type', choices: ['Fully dismantlable(Engineered)', 'Partially dismantlable(only legs)', 'Foldable(Metal)'] }
    },
    calculatePrice: (o) => {
      let base = o.size === 'King' ? 300 : o.size === 'Queen' ? 250 : o.size === 'Double' ? 220 : 150;
      let typeAdd = o.type === 'Fully dismantlable(Engineered)' ? 10 : 0;
      return base + typeAdd;
    },
    calculatePacking: () => 200
  },
  {
    id: 'mattress', name: 'Mattress', room: 'Bed Room', icon: Square,
    options: {
      size: { label: 'Size', choices: ['Single', 'Double', 'Queen', 'King'] },
      type: { label: 'Type', choices: ['Rollable', 'Non-Rollable'] }
    },
    calculatePrice: (o) => {
      let base = o.size === 'King' ? 250 : o.size === 'Queen' ? 130 : o.size === 'Double' ? 120 : 80;
      let typeAdd = o.type === 'Non-Rollable' ? 20 : 0;
      return base + typeAdd;
    },
    calculatePacking: () => 150
  },
  {
    id: 'bed_table', name: 'Bed-side table', room: 'Bed Room', icon: BedSingle,
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 80 : 60,
    calculatePacking: () => 50
  },
  {
    id: 'dressing', name: 'Dressing Table', room: 'Bed Room', icon: Sparkles,
    options: { size: { label: 'Size', choices: ['Small(1 column)', 'Medium(2 columns)', 'Large(3 Columns)'] } },
    calculatePrice: (o) => o.size === 'Large(3 Columns)' ? 150 : o.size === 'Medium(2 columns)' ? 130 : 120,
    calculatePacking: () => 150
  },
  { id: 'mirror', name: 'Full Length Mirror', room: 'Bed Room', icon: PanelRight, calculatePrice: () => 60, calculatePacking: () => 100 },
  {
    id: 'ac', name: 'Air-Conditioner', room: 'Bed Room', icon: Wind,
    options: { type: { label: 'Type', choices: ['Split AC', 'Window AC'] } },
    calculatePrice: (o) => o.type === 'Split AC' ? 150 : 130,
    calculatePacking: () => 150
  },
  {
    id: 'cooler', name: 'Air-Cooler', room: 'Bed Room', icon: Snowflake,
    options: { size: { label: 'Size', choices: ['Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : 90,
    calculatePacking: () => 100
  },
  {
    id: 'fan', name: 'Fan', room: 'Bed Room', icon: Fan,
    options: { type: { label: 'Type', choices: ['Table', 'Pedestal', 'Wall-Mount'] } },
    calculatePrice: (o) => o.type === 'Pedestal' ? 80 : 60,
    calculatePacking: () => 50
  },

  // KITCHEN AND DINING
  {
    id: 'fridge', name: 'Refrigerator', room: 'Kitchen and Dining', icon: Refrigerator,
    options: { type: { label: 'Type', choices: ['Single Door', 'Double Door', 'Side by Side'] } },
    calculatePrice: (o) => o.type === 'Side by Side' ? 200 : o.type === 'Double Door' ? 180 : 150,
    calculatePacking: () => 300
  },
  {
    id: 'dining', name: 'Dining Table', room: 'Kitchen and Dining', icon: Utensils,
    options: {
      seats: { label: 'Seats', choices: ['4 Seater', '6 Seater', '8 Seater'] },
      type: { label: 'Top Type', choices: ['Round', 'Square'] },
      glassMounted: { label: 'Glass Top', isCheckbox: true }
    },
    calculatePrice: (o) => o.seats === '8 Seater' ? 500 : o.seats === '6 Seater' ? 300 : 200,
    calculatePacking: () => 200
  },
  { id: 'dw', name: 'Dishwasher', room: 'Kitchen and Dining', icon: WashingMachine, calculatePrice: () => 150, calculatePacking: () => 150 },
  { id: 'mw', name: 'Microwave/OTG Oven', room: 'Kitchen and Dining', icon: Microwave, calculatePrice: () => 70, calculatePacking: () => 100 },
  {
    id: 'pantry', name: 'Pantry Cabinet', room: 'Kitchen and Dining', icon: Box,
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 100 : 80,
    calculatePacking: () => 150
  },
  {
    id: 'stove', name: 'Gas Stove', room: 'Kitchen and Dining', icon: Flame,
    options: { size: { label: 'Burners', choices: ['1-2 Burner', '2-4 Burner'] } },
    calculatePrice: (o) => o.size === '2-4 Burner' ? 90 : 70,
    calculatePacking: () => 50
  },
  { id: 'cylinder', name: 'Cylinder', room: 'Kitchen and Dining', icon: Cylinder, calculatePrice: () => 70, calculatePacking: () => 50 },
  { id: 'purifier', name: 'Water purifier', room: 'Kitchen and Dining', icon: Droplet, calculatePrice: () => 60, calculatePacking: () => 50 },

  // STUDY ROOM
  {
    id: 'desk', name: 'Desk/Table', room: 'Study Room', icon: BookOpen,
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 150 : o.size === 'Medium' ? 100 : 80,
    calculatePacking: () => 150
  },
  {
    id: 'chair', name: 'Chair', room: 'Study Room', icon: Armchair,
    options: { type: { label: 'Type', choices: ['Office', 'Plastic(Stackable)', 'Plastic', 'Metal'] } },
    calculatePrice: (o) => o.type === 'Office' ? 100 : o.type === 'Metal' ? 40 : o.type === 'Plastic' ? 35 : 30,
    calculatePacking: () => 50
  },
  {
    id: 'monitor', name: 'Monitor', room: 'Study Room', icon: Monitor,
    options: { size: { label: 'Size', choices: ['24"-32"', '32"+'] } },
    calculatePrice: (o) => o.size === '32"+' ? 150 : 120,
    calculatePacking: () => 100
  },
  { id: 'printer', name: 'Printer', room: 'Study Room', icon: Printer, calculatePrice: () => 80, calculatePacking: () => 80 },

  // UTILITY AND STORAGE
  {
    id: 'wm', name: 'Washing Machine', room: 'Utility and Storage', icon: WashingMachine,
    options: { type: { label: 'Type', choices: ['Top Load', 'Front Load'] } },
    calculatePrice: (o) => o.type === 'Front Load' ? 150 : 130,
    calculatePacking: () => 150
  },
  { id: 'vacuum', name: 'Vaccum Cleaner', room: 'Utility and Storage', icon: Wind, calculatePrice: () => 60, calculatePacking: () => 50 },
  {
    id: 'luggage', name: 'Luggage Bags', room: 'Utility and Storage', icon: Briefcase,
    options: { size: { label: 'Size', choices: ['Small', 'Medium', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 100 : o.size === 'Medium' ? 70 : 50,
    calculatePacking: () => 30
  },
  {
    id: 'gunny', name: 'Gunny Bags', room: 'Utility and Storage', icon: ShoppingBag,
    options: { size: { label: 'Size', choices: ['Large (25 Kg)', 'Extra Large (50 Kg)'] } },
    calculatePrice: (o) => o.size === 'Extra Large (50 Kg)' ? 100 : 60,
    calculatePacking: () => 30
  },
  { id: 'ladder', name: 'Ladder', room: 'Utility and Storage', icon: AlignJustify, calculatePrice: () => 100, calculatePacking: () => 50 },
  { id: 'ironing', name: 'Ironing Stand', room: 'Utility and Storage', icon: Table, calculatePrice: () => 60, calculatePacking: () => 30 },
  { id: 'bucket', name: 'Buckets/Tubs/Bins', room: 'Utility and Storage', icon: PaintBucket, calculatePrice: () => 50, calculatePacking: () => 20 },
  {
    id: 'drum', name: 'Drum', room: 'Utility and Storage', icon: Cylinder,
    options: { size: { label: 'Size', choices: ['Small (Below 100 ltrs)', 'Large(Above 100 ltrs)'] } },
    calculatePrice: (o) => o.size === 'Large(Above 100 ltrs)' ? 150 : 100,
    calculatePacking: () => 30
  },

  // BOXES
  {
    id: 'box', name: 'Storage Box', room: 'Boxes', icon: Package,
    options: { size: { label: 'Size', choices: ['Small', 'Medium(Avati Standard Size)', 'Large'] } },
    calculatePrice: (o) => o.size === 'Large' ? 80 : o.size === 'Medium(Avati Standard Size)' ? 60 : 50,
    calculatePacking: () => 20
  },

  // VEHICLES
  { id: 'kids_cycle', name: 'Kids Cycle', room: 'Vehicles', icon: Bike, calculatePrice: () => 100, calculatePacking: () => 50 },
  { id: 'cycle', name: 'Cycle', room: 'Vehicles', icon: Bike, calculatePrice: () => 150, calculatePacking: () => 100 },
];

const ROOM_TABS = [
  { id: "Living Room", icon: Tv },
  { id: "Bed Room", icon: Bed },
  { id: "Kitchen and Dining", icon: Utensils },
  { id: "Study Room", icon: BookOpen },
  { id: "Utility and Storage", icon: Archive },
  { id: "Boxes", icon: Package },
];

// Vehicle types for dedicated Vehicle Storage tab
const VEHICLE_TYPES = [
  { id: 'kids_cycle', name: 'Kids Cycle', price: 100, icon: '🚲', insurance: false },
  { id: 'cycle', name: 'Cycle', price: 150, icon: '🚴', insurance: false },
  { id: 'two_wheeler', name: 'Two Wheeler / Bike', price: 500, icon: '🏍️', insurance: true },
  { id: 'hatchback', name: 'Hatchback Car', price: 2500, icon: '🚗', insurance: true },
  { id: 'sedan', name: 'Sedan Car', price: 3000, icon: '🚘', insurance: true },
  { id: 'suv', name: 'SUV / MUV', price: 3300, icon: '🚙', insurance: true },
];

const BANGALORE_AREAS = [
  // Central
  { name: 'MG Road', dist: 12 },
  { name: 'Ulsoor', dist: 10 },
  { name: 'Brigade Road', dist: 13 },
  { name: 'Richmond Town', dist: 14 },
  { name: 'Vasanth Nagar', dist: 13 },
  { name: 'Shivajinagar', dist: 12 },
  { name: 'Cubbon Park', dist: 14 },
  
  // South
  { name: 'Jayanagar', dist: 20 },
  { name: 'JP Nagar', dist: 22 },
  { name: 'HSR Layout', dist: 18 },
  { name: 'BTM Layout', dist: 20 },
  { name: 'Koramangala', dist: 16 },
  { name: 'Bannerghatta Road', dist: 25 },
  { name: 'Electronic City', dist: 28 },

  // East
  { name: 'Whitefield', dist: 15 },
  { name: 'Indiranagar', dist: 10 },
  { name: 'Marathahalli', dist: 14 },
  { name: 'Bellandur', dist: 18 },
  { name: 'KR Puram', dist: 5 },
  { name: 'Sarjapur Road', dist: 20 },
  { name: 'Varthur', dist: 18 },
  { name: 'Mahadevapura', dist: 8 },

  // North
  { name: 'Hebbal', dist: 12 },
  { name: 'Yelahanka', dist: 18 },
  { name: 'RT Nagar', dist: 11 },
  { name: 'Manyata Tech Park', dist: 8 },
  { name: 'Horamavu', dist: 3 },
  { name: 'Kalyan Nagar', dist: 5 },
  { name: 'Hennur', dist: 6 },
  { name: 'Kammanahalli', dist: 5 },

  // West
  { name: 'Rajajinagar', dist: 18 },
  { name: 'Malleshwaram', dist: 16 },
  { name: 'Vijayanagar', dist: 22 },
  { name: 'Kengeri', dist: 30 },
  { name: 'Magadi Road', dist: 25 },
  { name: 'Nagarbhavi', dist: 25 },
  
  // Storage specific (near us)
  { name: 'NRI Layout (Warehouse)', dist: 0 },
  { name: 'Kalkere', dist: 1 },
  { name: 'Ramamurthy Nagar', dist: 2 },
  { name: 'Banaswadi', dist: 6 },
].sort((a, b) => a.name.localeCompare(b.name));

const STORAGE_TYPES = [
  { id: 'Household', icon: Home, desc: 'Furniture, appliances & belongings' },
  { id: 'Business', icon: Briefcase, desc: 'Office & commercial inventory' },
  { id: 'Vehicle', icon: Car, desc: 'Cars, bikes & cycles' },
  { id: 'Document', icon: FileText, desc: 'Files, records & archives' },
];

const QUOTE_METHODS = [
  { id: 'inventory', label: 'List Items', icon: '📋', desc: 'Add items from our catalog' },
  { id: 'upload', label: 'Upload Photos', icon: '📸', desc: 'Upload pics or 360° of your space' },
  { id: 'visit', label: 'Request Site Visit', icon: '🏠', desc: 'We come and assess for free' },
];

const MIN_STORAGE_PRICE = 300;

const PLANS = [
  { id: 'basic', name: 'Basic', mult: 1.0, features: ['Standard secure storage', '24/7 CCTV Monitoring', 'Regular pest control'] },
  { id: 'premium', name: 'Premium', mult: 1.3, popular: true, features: ['3-Layer Professional Packing', 'Climate controlled', 'Dust-free environment'] },
  { id: 'professional', name: 'Professional', mult: 1.6, features: ['Wooden Vault Storage', 'Dedicated account manager', 'Insurance coverage up to 1L'] },
];

interface InventoryInstance {
  instanceId: string;
  itemId: string;
  options: Record<string, string>;
  quantity: number;
}

export function QuotationSystem({ isDashboard, onClose }: { isDashboard?: boolean, onClose?: () => void }) {
  const { dark } = useTheme();
  const [step, setStep] = useStickyState(isDashboard ? 2 : 1, 'avati_q_step');

  // Step 1: State
  const [customer, setCustomer] = useStickyState({ name: '', phone: '', email: '' }, 'avati_q_customer');
  const [storageType, setStorageType] = useStickyState('Household', 'avati_q_storageType');

  // Quote method (for step 3)
  const [quoteMethod, setQuoteMethod] = useStickyState('inventory', 'avati_q_quoteMethod');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [visitNote, setVisitNote] = useStickyState('', 'avati_q_visitNote');

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 2: Inventory (Household)
  const [activeRoom, setActiveRoom] = useStickyState(ROOM_TABS[0].id, 'avati_q_activeRoom');
  const [inventory, setInventory] = useStickyState<InventoryInstance[]>([], 'avati_q_inventory');
  const [customItems, setCustomItems] = useStickyState<{id:string;name:string;qty:number}[]>([], 'avati_q_customItems');
  const [newCustomItem, setNewCustomItem] = useStickyState('', 'avati_q_newCustomItem');

  // Vehicle storage state
  const [selectedVehicles, setSelectedVehicles] = useStickyState<Record<string, boolean>>({}, 'avati_q_selectedVehicles');
  const [vehicleMaintenance, setVehicleMaintenance] = useStickyState(false, 'avati_q_vehicleMaintenance');
  const [vehiclePickup, setVehiclePickup] = useStickyState(false, 'avati_q_vehiclePickup');

  // Business/Office storage state
  const [businessSqft, setBusinessSqft] = useStickyState(100, 'avati_q_businessSqft');

  // Document storage state
  const [docBoxes, setDocBoxes] = useStickyState(1, 'avati_q_docBoxes');
  const [docType, setDocType] = useStickyState('Standard Files', 'avati_q_docType');

  // Step 3: Logistics
  const [logistics, setLogistics] = useStickyState({
    pickupDate: '',
    duration: 1,
    buildingType: 'Apartment',
    liftAvailable: 'yes',
    floors: 0,
    pickupArea: '',
    distance: 10,
    packingRequired: false,
    transportRequired: false,
  }, 'avati_q_logistics');

  // Step 4: Plans & Financial
  const [selectedPlan, setSelectedPlan] = useStickyState('basic', 'avati_q_selectedPlan');
  const [hasGstin, setHasGstin] = useStickyState(false, 'avati_q_hasGstin');
  const [gstin, setGstin] = useStickyState('', 'avati_q_gstin');

  const [showAreaSuggest, setShowAreaSuggest] = useState(false);

  // Pro-rata: days from pickup to 5th of next month
  const calcProRata = (monthlyRate: number) => {
    if (!logistics.pickupDate) return monthlyRate;
    const pickup = new Date(logistics.pickupDate);
    const nextMonth = new Date(pickup.getFullYear(), pickup.getMonth() + 1, 5);
    const days = Math.max(1, Math.round((nextMonth.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round((monthlyRate / 30) * days);
  };


  const addInstance = (itemId: string) => {
    const itemDef = BASE_ITEMS.find(i => i.id === itemId)!;
    const defaultOptions: Record<string, string> = {};
    if (itemDef.options) {
      Object.entries(itemDef.options).forEach(([key, config]) => {
        if (config.isCheckbox) {
          defaultOptions[key] = 'false';
        } else if (config.choices) {
          defaultOptions[key] = config.choices[0];
        }
      });
    }
    setInventory(prev => [...prev, {
      instanceId: Math.random().toString(36).substring(2, 9),
      itemId,
      options: defaultOptions,
      quantity: 1
    }]);
  };

  const removeInstance = (instanceId: string) => {
    setInventory(prev => prev.filter(i => i.instanceId !== instanceId));
  };

  const updateInstanceOption = (instanceId: string, optionKey: string, optionValue: string) => {
    setInventory(prev => prev.map(inst => {
      if (inst.instanceId === instanceId) {
        return { ...inst, options: { ...inst.options, [optionKey]: optionValue } };
      }
      return inst;
    }));
  };

  const updateInstanceQuantity = (instanceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeInstance(instanceId);
      return;
    }
    setInventory(prev => prev.map(inst => {
      if (inst.instanceId === instanceId) {
        return { ...inst, quantity };
      }
      return inst;
    }));
  };

  const calculateCosts = () => {
    let rawStorageCost = 0;
    let rawPackingCost = 0;

    if (storageType === 'Household') {
      if (quoteMethod === 'inventory') {
        inventory.forEach(inst => {
          const def = BASE_ITEMS.find(i => i.id === inst.itemId);
          if (def) {
            rawStorageCost += def.calculatePrice(inst.options) * inst.quantity;
            rawPackingCost += def.calculatePacking(inst.options) * inst.quantity;
          }
        });
      }
    } else if (storageType === 'Business') {
      rawStorageCost = businessSqft * 34; // ₹34/sqft base
    } else if (storageType === 'Vehicle') {
      VEHICLE_TYPES.forEach(v => {
        if (selectedVehicles[v.id]) rawStorageCost += v.price;
      });
      if (vehicleMaintenance) rawStorageCost += 250;
    } else if (storageType === 'Document') {
      const pricePerBox = docType === 'Confidential' ? 120 : 80;
      rawStorageCost = docBoxes * pricePerBox;
    }

    const baseStorageCost = Math.max(rawStorageCost, storageType === 'Household' && inventory.length > 0 ? MIN_STORAGE_PRICE : rawStorageCost);
    const planMultiplier = storageType === 'Household' ? (PLANS.find(p => p.id === selectedPlan)?.mult || 1.0) : 1.0;
    const finalMonthlyStorage = baseStorageCost * planMultiplier;

    // Packing + Transport grouped (no GST on these)
    const appliedPackingCost = logistics.packingRequired ? rawPackingCost : 0;
    const transportCost = logistics.transportRequired ? 1500 + (logistics.distance * 50) : 0;
    const liftSurcharge = logistics.liftAvailable === 'no' && logistics.floors > 0 ? logistics.floors * 300 : 0;
    const packingAndTransport = appliedPackingCost + transportCost + liftSurcharge;

    // Business GST on storage only (18%)
    const storageGst = storageType === 'Business' ? finalMonthlyStorage * 0.18 : finalMonthlyStorage * 0.18;
    const proRataFirst = calcProRata(finalMonthlyStorage);
    const totalEstimate = proRataFirst + storageGst + packingAndTransport;

    return {
      baseStorageCost,
      monthlyStorage: finalMonthlyStorage,
      packingAndTransport,
      storageGst,
      proRataFirst: proRataFirst,
      totalEstimate: totalEstimate,
    };
  };

  const costs = calculateCosts();

  // ── Zoho Forms submission ──
  // Fires on step 1 Continue to capture contact + quote method immediately.
  // Uses fetch + no-cors: a "simple" cross-origin POST that bypasses CORS preflight
  // and is visible in the browser DevTools Network tab for easy debugging.
  const submitToZohoForms = async () => {
    const FORM_PERMA = '1d2Scw-4Eanc9NE1BnuHC0VwRFl8nlDx-362SOYaalI';
    const FORM_URL = `https://forms.zohopublic.in/avatisafestorage1/form/Contactdetails/formperma/${FORM_PERMA}/htmlRecords/submit`;

    const radioValue =
      quoteMethod === 'inventory' ? 'Live Quotation'
      : quoteMethod === 'upload'  ? 'Upload 360 Video'
      : 'Book Survey';

    const params = new URLSearchParams();
    // ── Zoho Forms system fields (from form HTML) ──
    params.append('formName',       'Contactdetails');
    params.append('formPerma',      FORM_PERMA);
    params.append('isPaymentForm',  'false');
    params.append('formType',       '0');
    params.append('zf_referrer_name', window.location.href);
    params.append('zf_redirect_url', '');
    params.append('zc_gad',         '');

    // ── Exact field names from live form HTML ──
    params.append('SingleLine',  'Avati Safe Storage');         // Company Name (required)
    params.append('SingleLine1', customer.name  || '');         // Name (required)
    params.append('PhoneNumber', customer.phone || '');         // Phone
    params.append('SingleLine2', customer.email || '');         // Email
    params.append('Radio',       radioValue);                   // Quote Method

    try {
      await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors', // opaque response — fire-and-forget, no CORS preflight
      });
      console.log('[ZohoForms] POST sent →', FORM_URL, Object.fromEntries(params));
    } catch (err) {
      console.error('[ZohoForms] fetch error:', err);
    }
  };



  const pushToZoho = async (isPartial: boolean) => {
    // Lead status based on how far through the form the user is
    let currentStatus = 'Contact only';
    if (!isPartial) {
      currentStatus = 'Quotation Generated';
    } else {
      if (step >= 5) currentStatus = 'Plan selected';
      else if (step >= 4) currentStatus = 'Logistics Provided';
      else if (step >= 3) currentStatus = 'Inventory Provided';
      else if (step >= 2) currentStatus = 'Storage Type Selected';
      else currentStatus = 'Contact only';
    }

    // Put the full name in Last Name — Zoho CRM displays leads by Last Name,
    // so splitting "test 123" → firstName="test", lastName="123" made the lead appear as "123".
    const firstName = '';
    const lastName  = (customer.name || '').trim() || 'Website Lead';

    let invList = '';
    if (storageType === 'Household') {
      invList = inventory.map(i => {
        const def = BASE_ITEMS.find(b => b.id === i.itemId);
        return def ? `${i.quantity}x ${def.name}` : '';
      }).filter(Boolean).join(', ');
    } else if (storageType === 'Business') {
      invList = `${businessSqft} sqft`;
    } else if (storageType === 'Vehicle') {
      invList = Object.keys(selectedVehicles).filter(k => selectedVehicles[k]).join(', ');
    } else if (storageType === 'Document') {
      invList = `${docBoxes} boxes of ${docType}`;
    }

    const methodMap: Record<string, string> = { inventory: 'Live Quotation', upload: 'Upload 360 Video', visit: 'Book Survey' };
    const planMap:   Record<string, string> = { basic: 'Basic', premium: 'Premium', professional: 'Pro' };

    const params = new URLSearchParams();
    // ── Auth tokens ──
    params.append('xnQsjsdp',  'a953c779a14bc6e4957548782b9158470d5e0b96d0d4e9bcf6d98eed4b4824ce');
    params.append('xmIwtLD',   '877469bab2a764d5f8c16fc97b26895976af0a4990366dcf8d0516de33cee768202c367687c3cbf63287341c1660361d');
    params.append('actionType','TGVhZHM=');
    params.append('zc_gad',    '');
    params.append('returnURL', 'https://www.avatisafestorage.com/');
    // ── Contact ──
    params.append('Company',    'Avati Website Lead');
    params.append('First Name', firstName);
    params.append('Last Name',  lastName);
    params.append('Email',      customer.email || '');
    params.append('Mobile',     customer.phone || '');
    // ── Lead data ──
    params.append('Lead Source', 'Online Store');
    params.append('Lead Status', currentStatus);
    params.append('LEADCF6',    methodMap[quoteMethod] || 'Live Quotation');
    params.append('LEADCF2',    storageType || 'Household');
    params.append('LEADCF1',    invList || '');
    params.append('LEADCF5',    customItems.map(c => `${c.qty}x ${c.name}`).join(', ') || '');
    params.append('LEADCF3',    planMap[selectedPlan] || 'Basic');
    if (logistics.packingRequired)   params.append('LEADCF101', 'on');
    if (logistics.transportRequired) params.append('LEADCF102', 'on');
    const monthly  = Math.round(costs.monthlyStorage);
    const ptCharge = Math.round(costs.packingAndTransport);
    if (monthly  > 0) params.append('LEADCF67', monthly.toString());
    if (ptCharge > 0) params.append('LEADCF66', ptCharge.toString());
    params.append('Description', `Pickup: ${logistics.pickupDate || 'TBD'} | ${logistics.duration || 1} months | ${logistics.buildingType || 'N/A'} | Floor ${logistics.floors || 0} | Lift: ${logistics.liftAvailable}`);
    params.append('Address - Flat / House No./ Building / Apartment Name', logistics.pickupArea || '');
    params.append('aG9uZXlwb3Q', ''); // honeypot

    try {
      await fetch('https://crm.zoho.in/crm/WebToLeadForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors',
      });
      console.log('[ZohoCRM] POST sent → Step:', step, 'Status:', currentStatus);
    } catch (err) {
      console.error('[ZohoCRM] fetch error:', err);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      // Submit to both Zoho CRM and Zoho Forms in parallel
      await Promise.allSettled([
        pushToZoho(false),
        submitToZohoForms(),
      ]);
      setIsSuccess(true);
      // Clear localStorage quote data after 3s
      setTimeout(() => {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith('avati_q_')) localStorage.removeItem(key);
        }
      }, 3000);
      if (isDashboard && onClose) {
        setTimeout(() => onClose?.(), 4000);
      }
    } catch (err) {
      console.error('[Booking] Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuote = () => {
    if (window.confirm("Are you sure you want to clear your current progress and start a new quote?")) {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('avati_q_')) {
          localStorage.removeItem(key);
        }
      }
      window.location.href = (import.meta as any).env?.BASE_URL || '/';
    }
  };

  const renderSidebar = () => (
    <div className="rounded-2xl shadow-xl p-6 border h-full flex flex-col relative"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="shrink-0 mb-6 border-b pb-5 text-center relative" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Quote Summary</h2>
        </div>
        <h2 className="text-2xl font-black tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>Avati Safe Storage</h2>
        <div className="text-sm font-bold mt-1 tracking-widest uppercase" style={{ color: 'var(--gold)' }}>Live Quotation</div>
      </div>

      <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-1 hide-scrollbar">
        {/* Monthly storage */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Monthly Storage</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {storageType === 'Household' && quoteMethod !== 'inventory' ? 'To be quoted' : `₹${costs.monthlyStorage.toFixed(0)}`}
          </span>
        </div>

        {/* GST on storage */}
        <div className="flex justify-between items-center text-sm">
          <span style={{ color: 'var(--text-muted)' }}>GST (18%)</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {storageType === 'Household' && quoteMethod !== 'inventory' ? 'TBD' : `₹${costs.storageGst.toFixed(0)}`}
          </span>
        </div>

        {/* Packing + Transport (no GST, grouped) */}
        {step >= 4 && costs.packingAndTransport > 0 && (
          <div className="flex justify-between items-center text-sm border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Packing & Transport</span>
            <span style={{ color: 'var(--text-secondary)' }}>₹{costs.packingAndTransport.toFixed(0)}</span>
          </div>
        )}

        {/* Pro-rata first month */}
        {logistics.pickupDate && (storageType !== 'Household' || quoteMethod === 'inventory') && (
          <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--gold-surface)', border: '1px solid var(--gold-border)' }}>
            <p className="font-bold mb-1" style={{ color: 'var(--gold-dim)' }}>First Month (Pro-rata)</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Pickup date → 5th of next month
            </p>
            <p className="font-bold mt-1" style={{ color: 'var(--text-primary)' }}>₹{costs.proRataFirst.toFixed(0)}</p>
          </div>
        )}
      </div>

      <div className="shrink-0 mt-auto pt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col mb-5">
          <span className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Total Monthly Charges</span>
          <span className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            {storageType === 'Household' && quoteMethod !== 'inventory' ? 'TBD' : `₹${costs.monthlyStorage.toFixed(0)}`}
            {!(storageType === 'Household' && quoteMethod !== 'inventory') && <span className="text-base font-semibold ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>}
          </span>
          <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {storageType === 'Household' && quoteMethod !== 'inventory' ? 'Quotation pending analysis' : `+₹${costs.storageGst.toFixed(0)} GST · Packing/transport billed separately`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <button onClick={() => window.print()} className="py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <a href={`https://wa.me/918095589888?text=${encodeURIComponent(`Hi Avati Team, I have generated a quote on your website.\n\n*Name:* ${customer.name || 'Not provided'}\n*Storage Type:* ${storageType}\n*Plan:* ${selectedPlan.toUpperCase()}\n*Monthly Cost:* ₹${costs.monthlyStorage.toFixed(0)} + GST\n\nPlease contact me at ${customer.phone} to proceed!`)}`}
            target="_blank" rel="noopener noreferrer"
            className="py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
            style={{ background: 'rgba(37,211,102,0.12)', color: '#128C7E', border: '1px solid rgba(37,211,102,0.25)' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
        </div>

        <button
          disabled={isSubmitting || (step === 1 && (!customer.name || customer.phone.length < 10 || !customer.email.includes('@')))}
          onClick={async () => {
            if (step === 1) {
              // Capture contact + method in both CRM and Zoho Forms on first continue
              await Promise.allSettled([pushToZoho(true), submitToZohoForms()]);
              setStep(2);
            } else if (step < 5) {
              await pushToZoho(true);
              setStep(step + 1);
            } else {
              await handleConfirmBooking();
            }
          }}
          className="w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>{step < 5 ? 'Continue' : (isDashboard ? 'Add Items' : 'Confirm Booking')} <ChevronRight className="w-4 h-4" /></>
          )}
        </button>

        {step > (isDashboard ? 2 : 1) && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-2.5 mt-2 font-medium transition-colors text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Go Back
          </button>
        )}
        
        <button
          onClick={resetQuote}
          className="w-full py-2.5 mt-1 font-medium transition-colors text-sm hover:text-white flex items-center justify-center gap-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start New Quote
        </button>
      </div>
    </div>
  );

  const stepLabels = isDashboard
    ? ['Type', quoteMethod === 'upload' ? 'Media' : quoteMethod === 'visit' ? 'Visit' : 'Inventory', 'Logistics', 'Plans']
    : ['Details', 'Type', quoteMethod === 'upload' ? 'Media' : quoteMethod === 'visit' ? 'Visit' : 'Inventory', 'Logistics', 'Plans'];
  const stepLabelsLong = isDashboard
    ? ['Storage Type', quoteMethod === 'upload' ? 'Upload Media' : quoteMethod === 'visit' ? 'Site Visit' : 'Inventory', 'Logistics', 'Plans']
    : ['Customer Details', 'Storage Type', quoteMethod === 'upload' ? 'Upload Media' : quoteMethod === 'visit' ? 'Site Visit' : 'Inventory', 'Logistics', 'Plans'];

  // ── Success Overlay ──
  if (isSuccess) {
    return (
      <section id="quote" className={`py-16 sm:py-24 relative overflow-hidden ${isDashboard ? 'min-h-[80vh] rounded-2xl' : ''}`}
        style={{ background: dark ? 'linear-gradient(135deg, #0B1F3A 0%, #000000 100%)' : 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)' }}
      >
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)', boxShadow: '0 0 48px rgba(212,175,55,0.45)' }}
          >
            <Check className="w-12 h-12" style={{ color: '#000' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Booking Request Sent!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your quote has been received by our team. We'll reach out to <strong style={{ color: 'var(--gold)' }}>{customer.phone}</strong> within 24 hours.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm mb-10"
            style={{ color: 'var(--text-muted)' }}
          >
            A confirmation has also been logged in our Zoho CRM system.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
          >
            <a
              href={`https://wa.me/918095589888?text=${encodeURIComponent(`Hi Avati! I just submitted a storage quote on your website.\n\n*Name:* ${customer.name}\n*Phone:* ${customer.phone}\n*Storage Type:* ${storageType}\n*Plan:* ${selectedPlan?.toUpperCase()}\n*Monthly:* ₹${Math.round(costs.monthlyStorage)} + GST`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all"
              style={{ background: 'rgba(37,211,102,0.15)', color: '#128C7E', border: '1px solid rgba(37,211,102,0.3)' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Chat on WhatsApp
            </a>
            <button
              onClick={() => { setIsSuccess(false); setStep(1); }}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
            >
              Start New Quote
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className={`py-16 sm:py-24 relative overflow-hidden ${isDashboard ? 'min-h-[80vh] rounded-2xl' : ''}`}
      style={{ background: dark ? 'linear-gradient(135deg, #0B1F3A 0%, #000000 100%)' : 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)' }}
    >
      {isDashboard && (
        <button onClick={onClose} className="absolute top-6 right-6 z-50" style={{ color: 'var(--text-primary)' }}>
          <X className="w-8 h-8" />
        </button>
      )}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: 'rgba(212,175,55,0.07)' }} />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ background: dark ? 'rgba(59,130,246,0.05)' : 'rgba(11,31,58,0.06)' }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full mb-4 border"
            style={{ background: 'var(--gold-surface)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}>
            Instant Quote Engine
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
            High-Precision Quote Generator
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Detailed item-specific calculation — get your price in seconds
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 items-stretch lg:h-[750px] justify-center">
          <div className="flex-1 w-full flex flex-col min-h-0">

            {/* Progress Bar — short labels on mobile */}
            <div className="mb-5 sm:mb-8 backdrop-blur-sm px-4 py-4 sm:p-6 rounded-2xl shadow-xl shrink-0"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center justify-between relative z-10">
                {stepLabels.map((label, i) => {
                  const currentStep = isDashboard ? i + 2 : i + 1;
                  const isActive = step >= currentStep;
                  const isDone = step > currentStep;
                  return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 relative cursor-pointer" onClick={() => step > currentStep && setStep(currentStep)}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 z-10"
                      style={{
                        background: isActive ? '#D4AF37' : 'var(--bg-card)',
                        color: isActive ? '#000' : 'var(--text-muted)',
                        border: isActive ? 'none' : '2px solid var(--border-color)',
                        boxShadow: isDone ? '0 0 12px rgba(212,175,55,0.4)' : isActive ? '0 0 0 4px rgba(212,175,55,0.2)' : 'none',
                      }}>
                      {step > currentStep ? <Check className="w-4 h-4" /> : (i + 1)}
                    </div>
                    <span className="text-[9px] sm:text-xs font-medium text-center leading-tight"
                      style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)' }}>
                      <span className="sm:hidden">{label}</span>
                      <span className="hidden sm:block">{stepLabelsLong[i]}</span>
                    </span>
                  </div>
                )})}
                <div className="absolute top-4 sm:top-5 left-[10%] w-[80%] h-[2px] -z-0"
                  style={{ background: 'var(--border-color)' }} />
                <div
                  className="absolute top-4 sm:top-5 left-[10%] h-[2px] transition-all duration-500 -z-0"
                  style={{
                    width: `${((step - 1) / (stepLabels.length - 1)) * 80}%`,
                    background: '#D4AF37',
                    boxShadow: '0 0 8px rgba(212,175,55,0.4)',
                  }}
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {/* TAB 1: Customer Info & Method */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl p-6 sm:p-8 h-full overflow-y-auto hide-scrollbar"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>1. Your Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                          <input type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="avati-input" placeholder="Your Name" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                          <input type="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} className="avati-input" placeholder="000-000-0000" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                          <input type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} className="avati-input" placeholder="example@gmail.com" />
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>2. Choose Quote Method</h2>
                      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>How would you like us to generate your quotation?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'inventory', title: 'Live Quotation', desc: 'Select items instantly for a quick estimate.', icon: Zap },
                          { id: 'upload', title: 'Upload 360°', desc: 'Upload photos/videos of your space for accuracy.', icon: Camera },
                          { id: 'visit', title: 'Request Site Visit', desc: 'Our experts visit and assess your requirements.', icon: MapPin }
                        ].map(method => {
                          const isSelected = quoteMethod === method.id;
                          return (
                          <div 
                            key={method.id}
                            onClick={() => setQuoteMethod(method.id)}
                            className="p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group flex flex-col items-center text-center"
                            style={{
                              borderColor: isSelected ? 'var(--gold)' : 'var(--border-color)',
                              background: isSelected ? 'var(--gold-surface)' : 'var(--bg-secondary)',
                              boxShadow: isSelected ? '0 0 16px var(--gold-glow)' : 'none'
                            }}
                          >
                             <motion.div 
                               animate={isSelected ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}} 
                               transition={{ duration: 0.5 }}
                               className="mb-3 flex items-center justify-center w-12 h-12 rounded-full"
                               style={{ background: isSelected ? 'var(--gold)' : 'var(--bg-card)', color: isSelected ? '#000' : 'var(--text-muted)' }}
                             >
                               <method.icon className="w-6 h-6" />
                             </motion.div>
                             <h3 className="font-bold mb-1" style={{ color: isSelected ? 'var(--gold-dim)' : 'var(--text-primary)' }}>{method.title}</h3>
                             <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{method.desc}</p>
                             
                             {isSelected && (
                                <motion.div layoutId="method-active" className="absolute top-3 right-3 text-[#EAB308]">
                                  <Check className="w-5 h-5" />
                                </motion.div>
                             )}
                          </div>
                        )})}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: Storage Type */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl p-6 sm:p-8 h-full overflow-y-auto"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>What type of storage do you need?</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {STORAGE_TYPES.map(type => (
                          <div
                            key={type.id}
                            onClick={() => { setStorageType(type.id); setStep(3); }}
                            className="p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all min-h-[100px] justify-center text-center"
                            style={{
                              borderColor: storageType === type.id ? 'var(--gold)' : 'var(--border-color)',
                              backgroundColor: storageType === type.id ? 'var(--gold-surface)' : 'var(--bg-secondary)',
                              boxShadow: storageType === type.id ? '0 0 16px var(--gold-glow)' : 'none',
                            }}
                          >
                            <type.icon className="w-8 h-8" style={{ color: storageType === type.id ? 'var(--gold)' : 'var(--text-muted)' }} />
                            <span className="font-bold text-sm" style={{ color: storageType === type.id ? 'var(--gold-dim)' : 'var(--text-primary)' }}>{type.id}</span>
                            <span className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>{type.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: Storage-type specific inventory */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                     {/* ── SITE VISIT FLOW ── */}
                     {quoteMethod === 'visit' ? (
                       <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-secondary)' }}>
                         <motion.div 
                           initial={{ scale: 0.9, opacity: 0 }} 
                           animate={{ scale: 1, opacity: 1 }}
                           className="max-w-xl w-full rounded-2xl p-8 border-2"
                           style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                         >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--gold-surface)', color: 'var(--gold)' }}>
                               <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Schedule Site Visit</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Our supervisor will visit your location to assess the inventory precisely. Service charges may apply (approx ₹500).</p>
                            
                            <div className="space-y-4 text-left">
                               <div>
                                 <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Preferred Visit Date</label>
                                 <input type="date" value={visitNote} onChange={e => setVisitNote(e.target.value)} className="w-full p-4 rounded-xl border outline-none transition-all avati-input" />
                               </div>
                               <div>
                                 <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Visit Address & Notes</label>
                                 <textarea placeholder="Enter your full address and any specific instructions..." className="w-full p-4 rounded-xl border outline-none transition-all min-h-[100px] avati-input"></textarea>
                               </div>
                            </div>
                         </motion.div>
                       </div>
                     ) : quoteMethod === 'upload' ? (
                       <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-secondary)' }}>
                         <motion.div 
                           initial={{ scale: 0.9, opacity: 0 }} 
                           animate={{ scale: 1, opacity: 1 }}
                           className="max-w-xl w-full rounded-2xl p-8 border-2 border-dashed"
                           style={{ background: 'var(--bg-card)', borderColor: 'var(--gold-border)' }}
                         >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--gold-surface)', color: 'var(--gold)' }}>
                               <Camera className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Upload Media</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Upload photos or a 360° video of your space. Our experts will analyze them and provide a custom quote.</p>
                            
                            <div className="relative group cursor-pointer">
                              <input type="file" multiple accept="image/*,video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setUploadedFiles(Array.from(e.target.files || []))} />
                              <div className="py-8 px-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                                <ImageIcon className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                                <span className="font-bold text-sm" style={{ color: 'var(--gold)' }}>Click or drag files here</span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG, MP4</span>
                              </div>
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div className="mt-6 text-left">
                                <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>Selected Files ({uploadedFiles.length})</h4>
                                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                  {uploadedFiles.map((f, i) => (
                                    <div key={i} className="flex-shrink-0 w-16 h-16 rounded-lg border flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                                      {f.type.startsWith('image') ? (
                                        <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <Video className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                         </motion.div>
                       </div>
                     ) : (
                       <>
                         {/* ── VEHICLE STORAGE ── */}
                         {storageType === 'Vehicle' && (
                           <div className="p-5 overflow-y-auto flex-1">
                             <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Vehicle Storage</h3>
                             <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Select the vehicles you want to store. Monthly rates below.</p>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                               {VEHICLE_TYPES.map(v => (
                                 <button key={v.id} onClick={() => setSelectedVehicles(prev => ({ ...prev, [v.id]: !prev[v.id] }))}
                                   className="p-4 rounded-xl border-2 flex flex-col gap-2 transition-all text-left"
                                   style={{
                                     borderColor: selectedVehicles[v.id] ? 'var(--gold)' : 'var(--border-color)',
                                     background: selectedVehicles[v.id] ? 'var(--gold-surface)' : 'var(--bg-secondary)',
                                   }}>
                                   <Car className="w-6 h-6" style={{ color: selectedVehicles[v.id] ? 'var(--gold)' : 'var(--text-muted)' }} />
                                   <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v.name}</span>
                                   <span className="text-xs font-semibold" style={{ color: 'var(--gold-dim)' }}>₹{v.price}/mo</span>
                                   {v.insurance && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>Insurance recommended</span>}
                                 </button>
                               ))}
                             </div>
                             <div className="rounded-xl p-4 border space-y-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                               <label className="flex items-center gap-3 cursor-pointer">
                                 <input type="checkbox" checked={vehicleMaintenance} onChange={e => setVehicleMaintenance(e.target.checked)} className="w-5 h-5 accent-[#D4AF37]" />
                                 <div>
                                   <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>15-day Battery Maintenance — ₹250</p>
                                   <p className="text-xs" style={{ color: 'var(--text-muted)' }}>We start your vehicle every 15 days to maintain battery health</p>
                                 </div>
                               </label>
                             </div>
                             <p className="text-xs mt-4 p-3 rounded-lg" style={{ background: 'var(--gold-surface)', color: 'var(--text-secondary)' }}>
                               <strong>Note:</strong> Vehicle insurance is the owner's responsibility. We recommend insuring your vehicle before storage. Avati is not liable for pre-existing damage.
                             </p>
                           </div>
                         )}

                         {/* ── BUSINESS/OFFICE STORAGE ── */}
                         {storageType === 'Business' && (
                           <div className="p-5 overflow-y-auto flex-1">
                             <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Business / Office Storage</h3>
                             <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Priced at ₹34 per sq.ft per month + 18% GST.</p>
                             <div className="mb-6">
                               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Estimated Storage Area (sq.ft)</label>
                               <div className="flex items-center gap-4">
                                 <input type="range" min={50} max={5000} step={50} value={businessSqft}
                                   onChange={e => setBusinessSqft(Number(e.target.value))}
                                   className="flex-1 accent-[#D4AF37]" />
                                 <div className="w-24 text-center font-black text-xl" style={{ color: 'var(--gold)' }}>{businessSqft} sqft</div>
                               </div>
                               <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--gold-surface)', border: '1px solid var(--gold-border)' }}>
                                 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Estimated Monthly: <strong style={{ color: 'var(--text-primary)' }}>₹{(businessSqft * 34).toLocaleString()}</strong></p>
                                 <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>GST (18%): <strong style={{ color: 'var(--text-primary)' }}>₹{Math.round(businessSqft * 34 * 0.18).toLocaleString()}</strong></p>
                                 <p className="text-base font-black mt-2" style={{ color: 'var(--gold)' }}>Total: ₹{Math.round(businessSqft * 34 * 1.18).toLocaleString()}/mo</p>
                               </div>
                             </div>
                             <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Minimum booking: 1 month. Rate includes secure bay, CCTV, pest control. Packing & transport quoted separately.</p>
                           </div>
                         )}

                         {/* ── DOCUMENT STORAGE ── */}
                         {storageType === 'Document' && (
                           <div className="p-5 overflow-y-auto flex-1">
                             <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Document Storage</h3>
                             <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Secure, indexed, pest-free archival storage for your records.</p>
                             <div className="space-y-5">
                               <div>
                                 <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Document Type</label>
                                 <div className="flex gap-3">
                                   {['Standard Files', 'Confidential', 'Legal Records'].map(t => (
                                     <button key={t} onClick={() => setDocType(t)}
                                       className="px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                                       style={{
                                         borderColor: docType === t ? 'var(--gold)' : 'var(--border-color)',
                                         background: docType === t ? 'var(--gold-surface)' : 'transparent',
                                         color: docType === t ? 'var(--gold-dim)' : 'var(--text-secondary)',
                                       }}>
                                       {t}
                                     </button>
                                   ))}
                                 </div>
                               </div>
                               <div>
                                 <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Number of Boxes / Files</label>
                                 <div className="flex items-center gap-3">
                                   <button onClick={() => setDocBoxes(b => Math.max(1, b - 1))}
                                     className="w-10 h-10 rounded-xl font-bold text-lg border flex items-center justify-center"
                                     style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>−</button>
                                   <span className="text-2xl font-black w-16 text-center" style={{ color: 'var(--text-primary)' }}>{docBoxes}</span>
                                   <button onClick={() => setDocBoxes(b => b + 1)}
                                     className="w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center"
                                     style={{ background: 'var(--gold-surface)', color: 'var(--gold-dim)' }}>+</button>
                                 </div>
                                 <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
                                   {docType === 'Confidential' ? '₹120' : '₹80'} per box/month · Total: <strong style={{ color: 'var(--gold)' }}>₹{(docBoxes * (docType === 'Confidential' ? 120 : 80)).toLocaleString()}/mo</strong>
                                 </p>
                               </div>
                             </div>
                           </div>
                         )}

                         {/* ── HOUSEHOLD STORAGE ── */}
                         {storageType === 'Household' && (
                           <div className="flex flex-col h-full overflow-hidden">

                    {/* Room tabs — horizontal scrollable */}
                    <div className="flex overflow-x-auto justify-start p-3 gap-2 hide-scrollbar border-b shrink-0 shadow-sm relative z-10 w-full"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                    >
                      {ROOM_TABS.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveRoom(tab.id)}
                          className="whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 flex-shrink-0"
                          style={activeRoom === tab.id
                            ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#000', boxShadow: '0 4px 12px var(--gold-glow)' }
                            : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }
                          }
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.id}
                        </button>
                      ))}
                    </div>

                    {/* Inventory grid */}
                    <div className="p-4 sm:p-5 flex-1 overflow-y-auto pb-28 lg:pb-5" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
                        {BASE_ITEMS.filter(i => i.room === activeRoom).map(itemDef => {
                          const itemInstances = inventory.filter(inst => inst.itemId === itemDef.id);

                          return (
                            <div key={itemDef.id}
                              className="p-4 sm:p-5 rounded-2xl transition-all"
                              style={{
                                background: 'var(--bg-card)',
                                border: `2px solid ${itemInstances.length > 0 ? 'var(--gold-border)' : 'var(--border-color)'}`,
                                boxShadow: itemInstances.length > 0 ? 'var(--shadow-gold)' : 'var(--shadow-card)',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                                  >
                                    <itemDef.icon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                  </div>
                                  <div>
                                    <h3 className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{itemDef.name}</h3>
                                    {itemInstances.length === 0 && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{itemDef.options ? 'Tap + to configure' : 'Standard item'}</p>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  {itemInstances.length > 0 && <span className="font-bold text-base w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold-surface)', color: 'var(--gold-dim)' }}>{itemInstances.reduce((sum, inst) => sum + inst.quantity, 0)}</span>}
                                  {/* Thumb-friendly + button */}
                                  <button onClick={() => addInstance(itemDef.id)}
                                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                                    style={{ background: 'var(--gold-surface)', color: 'var(--gold-dim)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-border)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold-surface)')}
                                  >
                                    <Plus className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>

                              {itemInstances.length > 0 && (
                                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                  {itemInstances.map((inst) => (
                                    <div key={inst.instanceId} className="p-3 sm:p-4 rounded-xl relative"
                                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                                    >
                                      <button onClick={() => removeInstance(inst.instanceId)}
                                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-colors"
                                        style={{ color: '#e57373' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(229,115,115,0.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>

                                      {itemDef.options && Object.entries(itemDef.options).map(([optKey, optConfig]) => (
                                        <div key={optKey} className="mb-3 last:mb-0">
                                          {optConfig.isCheckbox ? (
                                            <label className="flex items-center gap-3 cursor-pointer py-1 w-fit">
                                              <input
                                                type="checkbox"
                                                checked={inst.options[optKey] === 'true'}
                                                onChange={(e) => updateInstanceOption(inst.instanceId, optKey, e.target.checked ? 'true' : 'false')}
                                                className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
                                              />
                                              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{optConfig.label}</span>
                                            </label>
                                          ) : (
                                            <>
                                              <label className="block text-xs font-medium mb-2 pr-8" style={{ color: 'var(--text-muted)' }}>{optConfig.label}</label>
                                              <div className="flex flex-wrap gap-2">
                                                {optConfig.choices?.map(choice => {
                                                  const isSelected = inst.options[optKey] === choice;
                                                  return (
                                                    <button
                                                      key={choice}
                                                      onClick={() => updateInstanceOption(inst.instanceId, optKey, choice)}
                                                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                                                      style={isSelected
                                                        ? { background: 'var(--gold)', color: '#000' }
                                                        : { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                                                      }
                                                    >
                                                      {choice}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      ))}
                                      {!itemDef.options && <div className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Standard item configuration.</div>}
                                      <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                                        <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Quantity</span>
                                        <div className="flex items-center gap-2 rounded-lg p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                          <button onClick={() => updateInstanceQuantity(inst.instanceId, inst.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                                          >
                                            <Minus className="w-4 h-4" />
                                          </button>
                                          <span className="font-bold text-sm w-5 text-center" style={{ color: 'var(--text-primary)' }}>{inst.quantity}</span>
                                          <button onClick={() => updateInstanceQuantity(inst.instanceId, inst.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ background: 'var(--gold-surface)', color: 'var(--gold-dim)' }}
                                          >
                                            <Plus className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        <div className="mt-8 p-6 rounded-2xl border shadow-sm w-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                          <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Other Unlisted Items</label>
                          <textarea
                            placeholder="E.g., 1x Treadmill, 2x Bean bags..."
                            value={newCustomItem}
                            onChange={e => setNewCustomItem(e.target.value)}
                            className="avati-input min-h-[100px] resize-y"
                          />
                          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>These items will be manually verified during pickup and added to your quote.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </>
              )}
              </motion.div>
            )}

                {/* TAB 4: Logistics */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    <div className="rounded-2xl shadow-xl p-6 h-full overflow-y-auto pb-32"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Service Requirements</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Estimated Duration (Months)</label>
                          <input type="number" value={logistics.duration} onChange={e => setLogistics({ ...logistics, duration: Number(e.target.value) })} className="avati-input" min="1" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Expected Pickup Date</label>
                          <input type="date" value={logistics.pickupDate} onChange={e => setLogistics({ ...logistics, pickupDate: e.target.value })} className="avati-input" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className={`p-5 rounded-xl border-2 transition-colors`} style={{ borderColor: logistics.packingRequired ? 'var(--gold)' : 'var(--border-color)', background: logistics.packingRequired ? 'var(--gold-surface)' : 'var(--bg-primary)' }}>
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input type="checkbox" checked={logistics.packingRequired} onChange={e => setLogistics({ ...logistics, packingRequired: e.target.checked })} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                            <div>
                              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Professional Packing Required?</div>
                              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Calculated dynamically based on your nested item configurations.</div>
                            </div>
                          </label>
                        </div>

                        <div className={`p-5 rounded-xl border-2 transition-colors`} style={{ borderColor: logistics.transportRequired ? 'var(--gold)' : 'var(--border-color)', background: logistics.transportRequired ? 'var(--gold-surface)' : 'var(--bg-primary)' }}>
                          <label className="flex items-start gap-4 cursor-pointer">
                            <input type="checkbox" checked={logistics.transportRequired} onChange={e => setLogistics({ ...logistics, transportRequired: e.target.checked })} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                            <div>
                              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Transportation?</div>
                              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Base fee ₹1500 + Distance to Warehouse (₹50/km)</div>
                            </div>
                          </label>
                          {logistics.transportRequired && (
                            <div className="ml-9 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Search Pickup Area (Bangalore)</label>
                              <div className="relative mb-4">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308] w-5 h-5 z-10" />
                                <input
                                  type="text"
                                  placeholder="e.g. Indiranagar, HSR Layout..."
                                  value={logistics.pickupArea}
                                  onFocus={() => setShowAreaSuggest(true)}
                                  onChange={e => {
                                    setLogistics({ ...logistics, pickupArea: e.target.value, distance: 0 });
                                    setShowAreaSuggest(true);
                                  }}
                                  className="avati-input !pl-12"
                                />
                                {showAreaSuggest && logistics.pickupArea.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl z-50 max-h-60 overflow-y-auto" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                                    {BANGALORE_AREAS.filter(a => a.name.toLowerCase().includes(logistics.pickupArea.toLowerCase())).length > 0 ? (
                                      BANGALORE_AREAS.filter(a => a.name.toLowerCase().includes(logistics.pickupArea.toLowerCase())).map(area => (
                                        <div
                                          key={area.name}
                                          onClick={() => {
                                            setLogistics({ ...logistics, pickupArea: area.name, distance: area.dist });
                                            setShowAreaSuggest(false);
                                          }}
                                          className="px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0"
                                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                          onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold-surface)';
                                            (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                                          }}
                                          onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                          }}
                                        >
                                          <div className="font-bold">{area.name}</div>
                                          <div className="text-xs mt-1 opacity-70">{area.dist} km from Warehouse</div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>No areas found. Please try another name.</div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Distance to Warehouse (km)</label>
                              <input type="number" value={logistics.distance} readOnly className="w-full max-w-[150px] py-4 px-4 rounded-xl border outline-none font-bold cursor-not-allowed" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }} />
                            </div>
                          )}
                        </div>

                        <div className="p-6 rounded-2xl border shadow-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Building Type</label>
                              <div className="relative group">
                                <select value={logistics.buildingType} onChange={e => setLogistics({ ...logistics, buildingType: e.target.value })} className="avati-input appearance-none pr-12">
                                  <option value="Apartment">Apartment</option>
                                  <option value="Villa">Villa</option>
                                  <option value="Independent Building">Independent Building</option>
                                  <option value="Commercial Space">Commercial Space</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center pointer-events-none z-10 transition-colors" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Floor Number</label>
                              <input type="number" value={logistics.floors} onChange={e => setLogistics({ ...logistics, floors: Number(e.target.value) })} className="avati-input" min="0" />
                            </div>
                          </div>

                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Service Lift Available?</label>
                          <div className="relative group">
                            <select value={logistics.liftAvailable} onChange={e => setLogistics({ ...logistics, liftAvailable: e.target.value })} className="avati-input appearance-none pr-12">
                              <option value="yes">Yes, Lift Available</option>
                              <option value="no">No, Stairs Only</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center pointer-events-none z-10 transition-colors" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>

                          {logistics.liftAvailable === 'no' && logistics.floors > 0 && (
                            <div className="mt-4 text-sm font-bold p-4 rounded-xl border flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
                              ₹300 per floor surcharge applied for {logistics.floors} floors.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 5: Plans & GST */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col space-y-6 overflow-y-auto pr-2"
                  >
                    <h3 className="text-2xl font-bold mb-6 shrink-0" style={{ color: 'var(--text-primary)' }}>Select a Storage Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PLANS.map(plan => {
                        const isLocked = plan.id === 'professional';
                        const isSelected = selectedPlan === plan.id && !isLocked;
                        return (
                          <div
                            key={plan.id}
                            onClick={() => !isLocked && setSelectedPlan(plan.id)}
                            className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col group ${isLocked ? 'opacity-70 cursor-not-allowed' : isSelected ? 'cursor-pointer' : 'cursor-pointer'}`}
                            style={{
                               borderColor: isLocked ? 'var(--border-color)' : isSelected ? 'var(--gold)' : 'var(--border-color)',
                               background: isLocked ? 'var(--bg-secondary)' : isSelected ? 'var(--gold-surface)' : 'var(--bg-card)',
                               boxShadow: isSelected ? '0 0 16px var(--gold-glow)' : 'var(--shadow-card)'
                            }}
                          >
                            {isLocked && (
                              <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px]" style={{ background: 'var(--bg-overlay)' }}>
                                <span className="px-4 py-2 rounded-full font-bold text-sm border" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Currently not available</span>
                              </div>
                            )}

                            {plan.popular && (
                              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#EAB308] to-[#D9A006] text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md z-30">
                                Most Popular
                              </div>
                            )}
                            {isSelected && <div className="absolute top-4 right-4 text-[#EAB308] z-30"><Check className="w-5 h-5" /></div>}

                            <h3 className={`text-xl font-bold capitalize mb-2 relative z-10`} style={{ color: isSelected ? 'var(--gold)' : 'var(--text-primary)' }}>{plan.name}</h3>

                            <div className="text-3xl font-bold relative z-10 mb-4 border-b pb-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                              {storageType === 'Household' && quoteMethod !== 'inventory' ? 'TBD' : `₹${(costs.baseStorageCost * plan.mult).toFixed(0)}`}
                              {!(storageType === 'Household' && quoteMethod !== 'inventory') && <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>}
                            </div>

                            <ul className="space-y-3 flex-1 relative z-10">
                              {plan.features.map((feat, i) => (
                                <li key={i} className={`text-sm flex items-start gap-3`} style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                  <Check className={`w-4 h-4 mt-0.5 shrink-0`} style={{ color: isSelected ? 'var(--gold)' : 'var(--text-muted)' }} />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl shadow-xl p-8 mt-6" style={{ background: 'var(--bg-card)' }}>
                      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>GST Compliance</h3>
                      <div className="p-4 mb-6 rounded-xl border flex items-start gap-3" style={{ background: 'var(--gold-surface)', borderColor: 'var(--gold-border)' }}>
                        <Check className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>18% GST Applied</div>
                          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Standard Government GST rules apply to all storage bookings.</div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                        <label className="flex items-start gap-4 cursor-pointer">
                          <input type="checkbox" checked={hasGstin} onChange={e => setHasGstin(e.target.checked)} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                          <div>
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>B2B: I have a GST Number</div>
                            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Avail Input Tax Credit (ITC) for business purposes.</div>
                          </div>
                        </label>

                        {hasGstin && (
                          <div className="ml-9 mt-4 pl-4 border-l-2 border-[#EAB308]">
                            <label className="text-sm block mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Enter GSTIN</label>
                            <input type="text" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} className="avati-input font-mono uppercase tracking-widest" placeholder="29XXXXXXXXXXXXX" maxLength={15} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {isDashboard && step < 5 && (
              <div className="mt-6 p-6 rounded-2xl shadow-xl shrink-0 flex items-center justify-between gap-4 border relative z-10" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {step > 2 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-8 py-4 font-bold rounded-xl transition-all min-w-[150px]"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    Go Back
                  </button>
                )}
                <button
                  disabled={step === 3 && storageType === 'Household' && quoteMethod === 'inventory' && inventory.length === 0}
                  onClick={() => setStep(step + 1)}
                  className="flex-1 py-4 bg-[#EAB308] hover:bg-[#D9A006] text-black font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {(!isDashboard || step === 5) && (
            <div className="w-full lg:w-[380px] shrink-0">
              {renderSidebar()}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky cost bar — shows on small screens */}
      {!isDashboard && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 border-t border-white/10"
          style={{ background: 'rgba(11,31,58,0.97)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-2 w-full">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-600 bg-gray-800 text-white shrink-0 hover:bg-gray-700">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            )}
            
            <div className="flex-1 flex flex-col justify-center px-1">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Monthly</p>
              <p className="text-xl font-black text-[#EAB308] leading-none truncate">
                {storageType === 'Household' && quoteMethod !== 'inventory' ? 'TBD' : `₹${costs.totalEstimate.toFixed(0)}`}
              </p>
            </div>

            <button
              disabled={isSubmitting || (step === 1 && (!customer.name || customer.phone.length < 10 || !customer.email.includes('@'))) || (step === 3 && storageType === 'Household' && quoteMethod === 'inventory' && inventory.length === 0)}
              onClick={async () => {
                if (step === 1) {
                  // Capture contact + method in both CRM and Zoho Forms on first continue
                  await Promise.allSettled([pushToZoho(true), submitToZohoForms()]);
                  setStep(2);
                } else if (step < 5) {
                  await pushToZoho(true);
                  setStep(step + 1);
                } else {
                  await handleConfirmBooking();
                }
              }}
              className="px-5 py-3.5 bg-[#EAB308] hover:bg-[#D9A006] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-1 disabled:opacity-40 text-sm shrink-0"
            >
              {isSubmitting ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>{step < 5 ? 'Next' : 'Confirm'} <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
/* touch */ 
