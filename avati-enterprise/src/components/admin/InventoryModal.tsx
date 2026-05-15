import { useState } from 'react';
import {
  X, Package, MapPin, Info, CheckCircle2, Loader2,
  ChevronLeft, ChevronRight, Thermometer, AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import type { Customer } from '../../lib/googleSheets';

type InventoryCategory = 'Furniture' | 'Electronics' | 'Documents' | 'Equipment' | 'Industrial' | 'Apparel' | 'Perishables' | 'Other';

interface InventoryItem {
  id?: string;
  customerId: string;
  customerName: string;
  itemName: string;
  description?: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  zone: string;
  rack: string;
  weight?: string;
  dimensions?: string;
  isFragile: boolean;
  requiresClimate: boolean;
  dateAdded: string;
  dateExpected?: string;
  status: string;
  notes?: string;
}

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => Promise<{ success: boolean }>;
  customers: Customer[];
}

const CATEGORIES: InventoryCategory[] = [
  'Furniture', 'Electronics', 'Documents', 'Equipment',
  'Industrial', 'Apparel', 'Perishables', 'Other',
];
const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
const UNITS = ['units', 'boxes', 'pallets', 'cartons', 'kg', 'pieces', 'sets'];

const STEPS = [
  { id: 1, label: 'Item Details',    icon: Package },
  { id: 2, label: 'Location',        icon: MapPin },
  { id: 3, label: 'Special Handling', icon: Info },
  { id: 4, label: 'Review & Save',   icon: CheckCircle2 },
];

const empty: Omit<InventoryItem, 'id'> = {
  customerId: '',
  customerName: '',
  itemName: '',
  description: '',
  category: 'Other',
  quantity: 1,
  unit: 'units',
  zone: 'Zone A',
  rack: '',
  weight: '',
  dimensions: '',
  isFragile: false,
  requiresClimate: false,
  dateAdded: new Date().toISOString().split('T')[0],
  dateExpected: '',
  status: 'Stored',
  notes: '',
};

const inputCls = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all placeholder:text-gray-400";
const selectCls = inputCls + ' appearance-none cursor-pointer';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function InventoryModal({ open, onClose, onSave, customers }: InventoryModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Omit<InventoryItem, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const set = <K extends keyof typeof data>(key: K, val: (typeof data)[K]) =>
    setData(prev => ({ ...prev, [key]: val }));

  const next = () => setStep(s => Math.min(s + 1, STEPS.length));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleClose = () => {
    setStep(1);
    setData(empty);
    setSaved(false);
    setError('');
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const result = await onSave(data as InventoryItem);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(handleClose, 1800);
    } else {
      setError('Failed to save. Make sure Google Sheets is configured.');
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value?: string | number | boolean }) =>
    value !== undefined && value !== '' && value !== false ? (
      <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-900">{String(value)}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-brand-dark px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Receive Items</h2>
            <p className="text-brand-gold text-xs mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-1 overflow-x-auto flex-shrink-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => done && setStep(s.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    active ? 'bg-brand-dark text-white' :
                    done   ? 'bg-brand-gold/20 text-brand-dark cursor-pointer' :
                              'bg-gray-200 text-gray-400'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Step 1: Item Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-gold" /> Item Details
              </h3>
              <Field label="Customer" required>
                <select className={selectCls} value={data.customerId}
                  onChange={e => {
                    const c = customers.find(c => c.id === e.target.value);
                    setData(p => ({ ...p, customerId: e.target.value, customerName: c?.name || c?.company || '' }));
                  }}>
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.company || c.name} ({c.id})</option>
                  ))}
                </select>
              </Field>
              <Field label="Item / Product Name" required>
                <input className={inputCls} placeholder="e.g. Office Chairs (Black, Ergonomic)"
                  value={data.itemName} onChange={e => set('itemName', e.target.value)} />
              </Field>
              <Field label="Description">
                <textarea className={inputCls + ' resize-none'} rows={2}
                  placeholder="Brand, model number, color, condition, etc."
                  value={data.description || ''} onChange={e => set('description', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required>
                  <select className={selectCls} value={data.category} onChange={e => set('category', e.target.value as InventoryCategory)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Qty" required>
                    <input className={inputCls} type="number" min={1} value={data.quantity}
                      onChange={e => set('quantity', parseInt(e.target.value) || 1)} />
                  </Field>
                  <Field label="Unit">
                    <select className={selectCls} value={data.unit} onChange={e => set('unit', e.target.value)}>
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Weight (kg)">
                  <input className={inputCls} placeholder="e.g. 25" type="number"
                    value={data.weight || ''} onChange={e => set('weight', e.target.value)} />
                </Field>
                <Field label="Dimensions (L×W×H cm)">
                  <input className={inputCls} placeholder="e.g. 120×60×90"
                    value={data.dimensions || ''} onChange={e => set('dimensions', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Location ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" /> Warehouse Location
              </h3>
              <Field label="Zone" required>
                <div className="grid grid-cols-2 gap-3">
                  {ZONES.map(z => (
                    <button key={z} type="button" onClick={() => set('zone', z)}
                      className={clsx(
                        'p-3 rounded-xl border-2 text-sm font-semibold transition-all text-left',
                        data.zone === z
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-dark'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}>
                      {z}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Rack / Bin Number" required>
                <input className={inputCls} placeholder="e.g. A-12, B-04"
                  value={data.rack} onChange={e => set('rack', e.target.value.toUpperCase())} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date Received">
                  <input className={inputCls} type="date"
                    value={data.dateAdded || new Date().toISOString().split('T')[0]}
                    onChange={e => set('dateAdded', e.target.value)} />
                </Field>
                <Field label="Expected Retrieval Date">
                  <input className={inputCls} type="date"
                    value={data.dateExpected || ''} onChange={e => set('dateExpected', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 3: Special Handling ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-gold" /> Special Handling Requirements
              </h3>
              <div className="space-y-3">
                <label className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  data.isFragile ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                )}>
                  <input type="checkbox" className="mt-0.5 w-4 h-4 accent-orange-500"
                    checked={data.isFragile} onChange={e => set('isFragile', e.target.checked)} />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Fragile Items
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Items require careful handling — glass, ceramics, electronics, artwork, etc.</p>
                  </div>
                </label>

                <label className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  data.requiresClimate ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                )}>
                  <input type="checkbox" className="mt-0.5 w-4 h-4 accent-blue-500"
                    checked={data.requiresClimate} onChange={e => set('requiresClimate', e.target.checked)} />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <Thermometer className="w-4 h-4 text-blue-500" />
                      Climate Controlled Storage
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Requires temperature and humidity regulation (Zone B only).</p>
                  </div>
                </label>
              </div>

              <Field label="Additional Notes">
                <textarea className={inputCls + ' resize-none'} rows={3}
                  placeholder="Insurance value, pickup instructions, security notes, etc."
                  value={data.notes || ''} onChange={e => set('notes', e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Review & Confirm
              </h3>

              {saved ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">Items Received!</p>
                  <p className="text-sm text-gray-500 mt-1">Inventory logged to Google Sheets successfully.</p>
                </div>
              ) : (
                <>
                  {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <ReviewRow label="Customer" value={data.customerName || data.customerId} />
                    <ReviewRow label="Item Name" value={data.itemName} />
                    <ReviewRow label="Category" value={data.category} />
                    <ReviewRow label="Quantity" value={`${data.quantity} ${data.unit}`} />
                    <ReviewRow label="Weight" value={data.weight ? `${data.weight} kg` : undefined} />
                    <ReviewRow label="Dimensions" value={data.dimensions} />
                    <ReviewRow label="Location" value={`${data.zone}, Rack ${data.rack}`} />
                    <ReviewRow label="Date Received" value={data.dateAdded} />
                    <ReviewRow label="Expected Retrieval" value={data.dateExpected} />
                    <ReviewRow label="Fragile" value={data.isFragile ? '⚠️ Yes' : undefined} />
                    <ReviewRow label="Climate Controlled" value={data.requiresClimate ? '🌡️ Yes' : undefined} />
                    <ReviewRow label="Notes" value={data.notes} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <button onClick={back} disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length ? (
              <button onClick={next}
                disabled={
                  (step === 1 && (!data.customerId || !data.itemName)) ||
                  (step === 2 && !data.rack)
                }
                className="flex items-center gap-1.5 bg-brand-dark text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-brand-gold text-brand-dark px-6 py-2 rounded-xl text-sm font-bold hover:bg-brand-gold/90 disabled:opacity-60 shadow-md transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving to Sheets...' : 'Log Inventory'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
