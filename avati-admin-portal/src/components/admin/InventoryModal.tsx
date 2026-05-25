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

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm vault-input placeholder:text-brand-muted/30";
const selectCls = inputCls + ' appearance-none cursor-pointer';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold/95 mb-1.5">
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
      <div className="flex justify-between py-2.5 border-b border-brand-border/10 last:border-0 text-sm">
        <span className="text-brand-muted">{label}</span>
        <span className="font-semibold text-brand-text">{String(value)}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="vault-glass rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-brand-border/30">
        {/* Header */}
        <div className="bg-[#050505] border-b border-brand-border/20 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-black tracking-wide text-brand-text flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></span>
              RECEIVE VAULT INVENTORY
            </h2>
            <p className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-brand-muted hover:bg-brand-gold/10 hover:text-brand-gold transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Bar */}
        <div className="px-6 py-4 bg-brand-surface border-b border-brand-border/20 flex items-center gap-1 overflow-x-auto flex-shrink-0 hide-scrollbar">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => done && setStep(s.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all',
                    active ? 'bg-brand-gold text-[#000000] shadow-lg shadow-brand-gold/15' :
                    done   ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30 cursor-pointer hover:bg-brand-gold/20' :
                              'bg-brand-light text-brand-muted/40 border border-brand-border/10'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-brand-border/40 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Step 1: Item Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-brand-gold flex items-center gap-2 border-b border-brand-border/15 pb-2">
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
                <input className={inputCls} placeholder="Office Chairs (Black, Ergonomic)"
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
              <h3 className="font-bold text-sm text-brand-gold flex items-center gap-2 border-b border-brand-border/15 pb-2">
                <MapPin className="w-4 h-4 text-brand-gold" /> Warehouse Location
              </h3>
              <Field label="Zone" required>
                <div className="grid grid-cols-2 gap-3">
                  {ZONES.map(z => (
                    <button key={z} type="button" onClick={() => set('zone', z)}
                      className={clsx(
                        'p-3 rounded-xl border-2 text-sm font-bold transition-all text-left',
                        data.zone === z
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-gold shadow-lg shadow-brand-gold/5'
                          : 'border-brand-border/20 bg-brand-light text-brand-muted hover:border-brand-border/50 hover:text-brand-text'
                      )}>
                      {z}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Rack / Bin Number" required>
                <input className={inputCls} placeholder="A-12"
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
              <h3 className="font-bold text-sm text-brand-gold flex items-center gap-2 border-b border-brand-border/15 pb-2">
                <Info className="w-4 h-4 text-brand-gold" /> Special Handling Requirements
              </h3>
              <div className="space-y-3">
                <label className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  data.isFragile ? 'border-orange-500 bg-orange-500/5 text-orange-400' : 'border-brand-border/20 bg-brand-light text-brand-muted hover:border-brand-border/50'
                )}>
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-orange-500"
                    checked={data.isFragile} onChange={e => set('isFragile', e.target.checked)} />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-orange-400">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Fragile Items Protection
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Items require careful handling — glass, ceramics, electronics, artwork, etc.</p>
                  </div>
                </label>

                <label className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  data.requiresClimate ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' : 'border-brand-border/20 bg-brand-light text-brand-muted hover:border-brand-border/50'
                )}>
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-cyan-500"
                    checked={data.requiresClimate} onChange={e => set('requiresClimate', e.target.checked)} />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-cyan-400">
                      <Thermometer className="w-4 h-4 text-cyan-500" />
                      Climate Controlled Environment
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Requires temperature and humidity regulation (Zone B only).</p>
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
              <h3 className="font-bold text-sm text-brand-gold flex items-center gap-2 border-b border-brand-border/15 pb-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Review & Confirm
              </h3>

              {saved ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-brand-gold/15 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-brand-gold animate-bounce" />
                  </div>
                  <p className="text-lg font-bold text-brand-text">Items Logged Successfully!</p>
                  <p className="text-sm text-brand-muted mt-1">Inventory has been synchronized with Sheet database.</p>
                </div>
              ) : (
                <>
                  {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>}
                  <div className="bg-brand-surface border border-brand-border/15 rounded-xl p-4 space-y-1">
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
          <div className="px-6 py-4 bg-[#0a0a0c] border-t border-brand-border/20 flex justify-between items-center flex-shrink-0">
            <button onClick={back} disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-brand-muted hover:text-brand-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> BACK
            </button>
            {step < STEPS.length ? (
              <button onClick={next}
                disabled={
                  (step === 1 && (!data.customerId || !data.itemName)) ||
                  (step === 2 && !data.rack)
                }
                className="flex items-center gap-1.5 vault-btn-gold text-[#000000] px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-gold/10">
                CONTINUE <ChevronRight className="w-4 h-4 text-[#000000]" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 vault-btn-gold text-[#000000] px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all shadow-md shadow-brand-gold/15">
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#000000]" /> : <CheckCircle2 className="w-4 h-4 text-[#000000]" />}
                {saving ? 'SAVING RECORDS...' : 'LOG INVENTORY'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
