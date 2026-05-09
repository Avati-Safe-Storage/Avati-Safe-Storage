import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, ChevronRight, Minus, Plus, Check, Home, Building, Briefcase, FileText, Car, Trash2, 
  Tv, Bed, Utensils, BookOpen, Archive, Sofa, Table, Box, Speaker, BatteryCharging, 
  Image as ImageIcon, Sparkles, PanelRight, Wind, Snowflake, Fan, Refrigerator, Microwave, 
  Flame, Cylinder, Droplet, Armchair, Monitor, Printer, WashingMachine, ShoppingBag, 
  AlignJustify, PaintBucket, Footprints, Church, Square, BedSingle, Package, Download, ChevronDown 
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
];

const ROOM_TABS = [
  { id: "Living Room", icon: Tv },
  { id: "Bed Room", icon: Bed },
  { id: "Kitchen and Dining", icon: Utensils },
  { id: "Study Room", icon: BookOpen },
  { id: "Utility and Storage", icon: Archive },
  { id: "Boxes", icon: Package },
];

const BANGALORE_AREAS = [
  { name: 'Whitefield', dist: 15 },
  { name: 'Indiranagar', dist: 8 },
  { name: 'Koramangala', dist: 12 },
  { name: 'Electronic City', dist: 25 },
  { name: 'HSR Layout', dist: 14 },
  { name: 'Marathahalli', dist: 10 },
  { name: 'Bellandur', dist: 12 },
  { name: 'Jayanagar', dist: 16 },
  { name: 'JP Nagar', dist: 18 },
  { name: 'BTM Layout', dist: 15 },
  { name: 'Hebbal', dist: 10 },
  { name: 'Malleswaram', dist: 14 },
  { name: 'Yelahanka', dist: 18 },
  { name: 'Kalyan Nagar', dist: 3 },
  { name: 'Kammanahalli', dist: 4 },
  { name: 'Hennur', dist: 5 },
  { name: 'KR Puram', dist: 6 },
  { name: 'Mahadevapura', dist: 8 }
];

const STORAGE_TYPES = [
  { id: 'Household', icon: Home },
  { id: 'Office', icon: Building },
  { id: 'Business', icon: Briefcase },
  { id: 'Document', icon: FileText },
  { id: 'Vehicle', icon: Car },
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

export function QuotationSystem() {
  const [step, setStep] = useState(1);
  
  // Step 1: State
  const [storageType, setStorageType] = useState('Household');
  
  // Step 2: Inventory
  const [activeRoom, setActiveRoom] = useState(ROOM_TABS[0].id);
  const [inventory, setInventory] = useState<InventoryInstance[]>([]);
  
  // Step 3: Logistics
  const [logistics, setLogistics] = useState({
    pickupDate: '',
    duration: 1,
    buildingType: 'Apartment',
    liftAvailable: 'yes',
    floors: 0,
    pickupArea: '',
    distance: 10,
    packingRequired: false,
    transportRequired: false,
  });
  
  // Step 4: Plans & Financial
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [hasGstin, setHasGstin] = useState(false);
  const [gstin, setGstin] = useState('');

  const baseStorageCost = Math.max(
    MIN_STORAGE_PRICE, 
    inventory.reduce((acc, inst) => {
      const def = BASE_ITEMS.find(i => i.id === inst.itemId);
      return acc + (def ? def.calculatePrice(inst.options) * inst.quantity : 0);
    }, 0)
  );

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
    
    inventory.forEach(inst => {
      const def = BASE_ITEMS.find(i => i.id === inst.itemId);
      if (def) {
        rawStorageCost += def.calculatePrice(inst.options) * inst.quantity;
        rawPackingCost += def.calculatePacking(inst.options) * inst.quantity;
      }
    });

    const baseStorageCost = Math.max(rawStorageCost, inventory.length > 0 ? MIN_STORAGE_PRICE : 0);
    const planMultiplier = PLANS.find(p => p.id === selectedPlan)?.mult || 1.0;
    const finalMonthlyStorage = baseStorageCost * planMultiplier;

    const appliedPackingCost = logistics.packingRequired ? rawPackingCost : 0;
    const transportCost = logistics.transportRequired ? 1500 + (logistics.distance * 50) : 0;
    const liftSurcharge = logistics.liftAvailable === 'no' && logistics.floors > 0 ? logistics.floors * 300 : 0;

    const oneTimeSetup = appliedPackingCost + transportCost + liftSurcharge;
    const firstMonthSubtotal = finalMonthlyStorage + oneTimeSetup;
    const gst = firstMonthSubtotal * 0.18;
    const totalEstimate = firstMonthSubtotal + gst;

    return { 
      monthlyStorage: finalMonthlyStorage, 
      appliedPackingCost, 
      transportCost, 
      liftSurcharge, 
      oneTimeSetup, 
      firstMonthSubtotal, 
      gst, 
      totalEstimate 
    };
  };

  const costs = calculateCosts();

  const renderSidebar = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-full flex flex-col relative">
      <div className="shrink-0 mb-8 border-b border-gray-100 pb-6 text-center">
        <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight uppercase">Avati Safe Storage</h2>
        <div className="text-sm text-[#EAB308] font-bold mt-1 tracking-widest uppercase">Live Quotation Summary</div>
      </div>
      
      <div className="space-y-4 mb-6 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Storage (Monthly)</span>
          <span className="font-bold text-gray-900">₹{costs.monthlyStorage.toFixed(0)}</span>
        </div>
        
        {step >= 3 && logistics.packingRequired && costs.appliedPackingCost > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Professional Packing</span>
            <span className="font-bold text-gray-900">₹{costs.appliedPackingCost.toFixed(0)}</span>
          </div>
        )}
        
        {step >= 3 && logistics.transportRequired && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Transport ({logistics.distance}km)</span>
            <span className="font-bold text-gray-900">₹{costs.transportCost.toFixed(0)}</span>
          </div>
        )}

        {step >= 3 && costs.liftSurcharge > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Stairs Surcharge ({logistics.floors} Flr)</span>
            <span className="font-bold text-gray-900">₹{costs.liftSurcharge.toFixed(0)}</span>
          </div>
        )}

        {step >= 4 && (
          <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
            <span className="text-gray-600 font-bold">GST (18%)</span>
            <span className="font-bold text-gray-900">₹{costs.gst.toFixed(0)}</span>
          </div>
        )}
      </div>

      <div className="shrink-0 mt-auto pt-6 border-t border-gray-200">
        <div className="flex flex-col mb-6">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Monthly Charges</span>
          <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{costs.totalEstimate.toFixed(0)}</span>
          <span className="text-xs text-gray-400 font-medium mt-2">Includes 18% GST & One-time Setup</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="py-3 rounded-xl bg-[#25D366]/10 text-[#128C7E] font-bold text-sm hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg> WhatsApp
          </button>
        </div>

        <button 
          disabled={step === 2 && inventory.length === 0}
          onClick={() => step < 4 ? setStep(step + 1) : alert('Booking Request Sent!')}
          className="w-full py-4 bg-[#EAB308] hover:bg-[#D9A006] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#EAB308]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {step < 4 ? 'Continue' : 'Confirm Booking'} <ChevronRight className="w-5 h-5" />
        </button>

        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-full py-3 mt-3 text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section id="quote" className="py-24 bg-gradient-to-br from-[#0B1F3A] to-black min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#EAB308]/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">High-Precision Quote Generator</h2>
          <p className="text-lg text-gray-300">Detailed item-specific calculation engine</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:h-[750px]">
          <div className="flex-1 w-full flex flex-col min-h-0">
            
            {/* Progress Bar */}
            <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl shrink-0">
              <div className="flex items-center justify-between relative z-10">
                {['Storage Type', 'Inventory Config', 'Logistics', 'Plans'].map((label, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 flex-1 relative cursor-pointer" onClick={() => step > i + 1 && setStep(i + 1)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                      step > i + 1 ? 'bg-[#EAB308] text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : step === i + 1 ? 'bg-[#EAB308] text-black ring-4 ring-[#EAB308]/30' : 'bg-gray-800 text-gray-400 border-2 border-gray-700'
                    }`}>
                      {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden md:block ${step >= i + 1 ? 'text-[#EAB308]' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                ))}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-700 -z-0" />
                <div 
                  className="absolute top-5 left-0 h-[2px] bg-[#EAB308] transition-all duration-500 -z-0 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {/* TAB 1: Storage Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto"
                  >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of storage do you need?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {STORAGE_TYPES.map(type => (
                      <div 
                        key={type.id}
                        onClick={() => {
                          setStorageType(type.id);
                          setStep(2);
                        }}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 cursor-pointer transition-all ${
                          storageType === type.id ? 'border-[#EAB308] bg-[#EAB308]/5 text-[#D9A006]' : 'border-gray-100 hover:border-[#EAB308]/50 text-gray-600'
                        }`}
                      >
                        <type.icon className="w-10 h-10" />
                        <span className="font-semibold">{type.id}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Nested Inventory */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
                >
                  <div className="flex overflow-x-auto bg-gray-50 p-3 gap-2 hide-scrollbar border-b border-gray-100 shrink-0">
                    {ROOM_TABS.map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveRoom(tab.id)}
                        className={`whitespace-nowrap px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${activeRoom === tab.id ? 'bg-white shadow-sm text-[#EAB308] border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'}`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.id}
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {BASE_ITEMS.filter(i => i.room === activeRoom).map(itemDef => {
                        const itemInstances = inventory.filter(inst => inst.itemId === itemDef.id);
                        
                        return (
                          <div key={itemDef.id} className={`p-5 border-2 rounded-2xl transition-all bg-white ${itemInstances.length > 0 ? 'border-[#EAB308]/50 shadow-md' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                  <itemDef.icon className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{itemDef.name}</h3>
                                  {itemInstances.length === 0 && <p className="text-xs text-gray-500 mt-0.5">{itemDef.options ? 'Configure options upon adding' : 'Standard item'}</p>}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {itemInstances.length > 0 && <span className="font-bold text-lg bg-[#EAB308]/20 text-[#D9A006] w-8 h-8 rounded flex items-center justify-center">{itemInstances.reduce((sum, inst) => sum + inst.quantity, 0)}</span>}
                                <button onClick={() => addInstance(itemDef.id)} className="w-10 h-10 rounded-xl bg-[#EAB308]/10 flex items-center justify-center hover:bg-[#EAB308]/20 text-[#D9A006] transition-colors">
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {itemInstances.length > 0 && (
                              <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                                {itemInstances.map((inst) => (
                                  <div key={inst.instanceId} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                    <button onClick={() => removeInstance(inst.instanceId)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    {itemDef.options && Object.entries(itemDef.options).map(([optKey, optConfig]) => (
                                      <div key={optKey} className="mb-3 last:mb-0">
                                        {optConfig.isCheckbox ? (
                                          <label className="flex items-center gap-3 cursor-pointer mt-1 py-1 w-fit">
                                            <input 
                                              type="checkbox" 
                                              checked={inst.options[optKey] === 'true'}
                                              onChange={(e) => updateInstanceOption(inst.instanceId, optKey, e.target.checked ? 'true' : 'false')}
                                              className="w-5 h-5 accent-[#EAB308] rounded cursor-pointer"
                                            />
                                            <span className="text-sm font-semibold text-gray-800">{optConfig.label}</span>
                                          </label>
                                        ) : (
                                          <>
                                            <label className="block text-xs text-gray-600 font-medium mb-2 pr-8">{optConfig.label}</label>
                                            <div className="flex flex-wrap gap-2">
                                              {optConfig.choices?.map(choice => {
                                                const isSelected = inst.options[optKey] === choice;
                                                return (
                                                  <button 
                                                    key={choice} 
                                                    onClick={() => updateInstanceOption(inst.instanceId, optKey, choice)}
                                                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${isSelected ? 'bg-[#EAB308] text-black shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#EAB308]/50'}`}
                                                  >
                                                    {choice}
                                                  </button>
                                                )
                                              })}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                    {!itemDef.options && <div className="text-sm text-gray-500 mt-1 mb-3">Standard item configuration.</div>}
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                                      <span className="text-sm font-bold text-gray-700">Quantity</span>
                                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                                        <button 
                                          onClick={() => updateInstanceQuantity(inst.instanceId, inst.quantity - 1)}
                                          className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center">{inst.quantity}</span>
                                        <button 
                                          onClick={() => updateInstanceQuantity(inst.instanceId, inst.quantity + 1)}
                                          className="w-7 h-7 flex items-center justify-center rounded bg-[#EAB308]/20 text-[#D9A006] hover:bg-[#EAB308]/30"
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
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Logistics */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Service Requirements</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (Months)</label>
                        <input type="number" value={logistics.duration} onChange={e => setLogistics({...logistics, duration: Number(e.target.value)})} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#EAB308] outline-none transition-all" min="1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Pickup Date</label>
                        <input type="date" value={logistics.pickupDate} onChange={e => setLogistics({...logistics, pickupDate: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#EAB308] outline-none transition-all" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-5 rounded-xl border-2 transition-colors ${logistics.packingRequired ? 'border-[#EAB308] bg-[#EAB308]/5' : 'border-gray-100 hover:border-[#EAB308]/50'}`}>
                        <label className="flex items-start gap-4 cursor-pointer">
                          <input type="checkbox" checked={logistics.packingRequired} onChange={e => setLogistics({...logistics, packingRequired: e.target.checked})} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                          <div>
                            <div className="font-semibold text-gray-900">Professional Packing Required?</div>
                            <div className="text-sm text-gray-500 mt-1">Calculated dynamically based on your nested item configurations.</div>
                          </div>
                        </label>
                      </div>

                      <div className={`p-5 rounded-xl border-2 transition-colors ${logistics.transportRequired ? 'border-[#EAB308] bg-[#EAB308]/5' : 'border-gray-100 hover:border-[#EAB308]/50'}`}>
                        <label className="flex items-start gap-4 cursor-pointer">
                          <input type="checkbox" checked={logistics.transportRequired} onChange={e => setLogistics({...logistics, transportRequired: e.target.checked})} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                          <div>
                            <div className="font-semibold text-gray-900">Transportation from NRI Layout, Bangalore?</div>
                            <div className="text-sm text-gray-500 mt-1">Base fee ₹1500 + API Distance Calculation (₹50/km)</div>
                          </div>
                        </label>
                        {logistics.transportRequired && (
                          <div className="ml-9 mt-4 pt-4 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Area</label>
                            <div className="relative mb-4">
                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-[#EAB308] w-5 h-5" />
                              <select 
                                value={logistics.pickupArea} 
                                onChange={e => {
                                  const area = BANGALORE_AREAS.find(a => a.name === e.target.value);
                                  setLogistics({...logistics, pickupArea: e.target.value, distance: area ? area.dist : logistics.distance});
                                }} 
                                className="w-full pl-8 pr-8 py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#EAB308] outline-none transition-all appearance-none text-gray-900 font-semibold cursor-pointer"
                              >
                                <option value="" disabled>Select area...</option>
                                {BANGALORE_AREAS.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                              </select>
                              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Calculated Distance (km)</label>
                            <input type="number" value={logistics.distance} readOnly className="w-full max-w-[150px] py-3 bg-transparent border-b-2 border-gray-200 outline-none transition-all text-gray-500 font-semibold cursor-not-allowed" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Building Type</label>
                            <div className="relative">
                              <select value={logistics.buildingType} onChange={e => setLogistics({...logistics, buildingType: e.target.value})} className="w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#EAB308] outline-none transition-all appearance-none text-gray-900 font-medium cursor-pointer pr-8">
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Independent Building">Independent Building</option>
                              </select>
                              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Floor Number</label>
                            <input type="number" value={logistics.floors} onChange={e => setLogistics({...logistics, floors: Number(e.target.value)})} className="w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#EAB308] outline-none transition-all text-gray-900 font-medium" min="0" />
                          </div>
                        </div>

                        <label className="block text-sm font-semibold text-gray-900 mb-2">Service Lift Available?</label>
                        <div className="relative">
                          <select value={logistics.liftAvailable} onChange={e => setLogistics({...logistics, liftAvailable: e.target.value})} className="w-full py-3 bg-transparent border-b-2 border-gray-200 focus:border-[#EAB308] outline-none transition-all appearance-none text-gray-900 font-medium cursor-pointer pr-8">
                            <option value="yes">Yes, Lift Available</option>
                            <option value="no">No, Stairs Only</option>
                          </select>
                          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                        
                        {logistics.liftAvailable === 'no' && logistics.floors > 0 && (
                          <div className="mt-3 text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                            ₹300 per floor surcharge applied for {logistics.floors} floors.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Plans & GST */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col space-y-6 overflow-y-auto pr-2"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 shrink-0">Select a Storage Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map(plan => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col group ${isSelected ? 'border-[#EAB308] bg-[#EAB308]/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-gray-700 hover:border-[#EAB308]/50 bg-gray-800/80 backdrop-blur-sm'}`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br from-[#EAB308]/10 to-transparent opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}`} />
                          
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#EAB308] to-[#D9A006] text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md">
                              Most Popular
                            </div>
                          )}
                          {isSelected && <div className="absolute top-4 right-4 text-[#EAB308]"><Check className="w-5 h-5"/></div>}
                          
                          <h3 className={`text-xl font-bold capitalize mb-2 relative z-10 ${isSelected ? 'text-[#EAB308]' : 'text-white'}`}>{plan.name}</h3>
                          
                          <div className="text-3xl font-bold text-white relative z-10 mb-4 border-b border-gray-600/50 pb-4">
                            ₹{(baseStorageCost * plan.mult).toFixed(0)}
                            <span className="text-sm font-normal text-gray-400">/mo</span>
                          </div>

                          <ul className="space-y-3 flex-1 relative z-10">
                            {plan.features.map((feat, i) => (
                              <li key={i} className={`text-sm flex items-start gap-3 ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#EAB308]' : 'text-gray-600'}`} />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">GST Compliance</h3>
                    <div className="p-4 mb-6 rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/5 flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">18% GST Applied</div>
                        <div className="text-sm text-gray-600 mt-1">Standard Government GST rules apply to all storage bookings.</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-gray-100 bg-gray-50">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input type="checkbox" checked={hasGstin} onChange={e => setHasGstin(e.target.checked)} className="mt-1 w-5 h-5 accent-[#EAB308]" />
                        <div>
                          <div className="font-semibold text-gray-900">B2B: I have a GST Number</div>
                          <div className="text-sm text-gray-500 mt-1">Avail Input Tax Credit (ITC) for business purposes.</div>
                        </div>
                      </label>
                      
                      {hasGstin && (
                        <div className="ml-9 mt-4 pl-4 border-l-2 border-[#EAB308]">
                          <label className="text-sm text-gray-600 block mb-2 font-medium">Enter GSTIN</label>
                          <input type="text" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#EAB308] outline-none transition-all text-gray-900 bg-white font-mono uppercase tracking-widest" placeholder="29XXXXXXXXXXXXX" maxLength={15} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
          
          <div className="w-full lg:w-[400px] shrink-0">
             {renderSidebar()}
          </div>
        </div>
      </div>
    </section>
  );
}
