import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Warehouse, Package, IndianRupee } from 'lucide-react';
import clsx from 'clsx';
import { addStorage, addStoredItems, addPayment, updateCustomer } from '../../lib/googleSheets';
import { WAREHOUSES, WAREHOUSE_ROWS, WAREHOUSE_SECTIONS, PLANS, STORAGE_TYPES, BASE_ITEMS, calculateProration } from '../../lib/inventoryData';
import type { StorageType, StoragePlan } from '../../lib/googleSheets';
import ItemCatalogue from '../../components/admin/ItemCatalogue';
import type { CatalogueItem } from '../../components/admin/ItemCatalogue';

const STEPS = [
  { id: 1, label: 'Storage Location', icon: Warehouse },
  { id: 2, label: 'Add Items', icon: Package },
  { id: 3, label: 'Billing', icon: IndianRupee },
  { id: 4, label: 'Confirm', icon: CheckCircle2 },
];

const inp = 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>{children}</div>;
}

function RRow({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function StorageSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, customerName, pickupDate, plan: leadPlan, storageType: leadType } = location.state || {};

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [loc, setLoc] = useState({
    warehouse: 'WH1' as typeof WAREHOUSES[number],
    row: 'A' as typeof WAREHOUSE_ROWS[number],
    section: '1' as typeof WAREHOUSE_SECTIONS[number],
    plan: (leadPlan || 'basic') as StoragePlan,
    storageType: (leadType || 'Household') as StorageType,
    insuranceOpted: false,
  });
  const location3D = `${loc.warehouse}-${loc.row}-${loc.section.padStart(2, '0')}`;

  // Step 2
  const [items, setItems] = useState<CatalogueItem[]>([]);

  // Step 3 - billing
  const planMult = PLANS.find(p => p.id === loc.plan)?.mult || 1;
  const rawMonthly = items.reduce((s, it) => {
    const def = BASE_ITEMS.find(d => d.id === it.itemDefId);
    return s + (def ? def.calculatePrice(it.options) * it.quantity : it.price * it.quantity);
  }, 0);
  const monthlyRate = Math.max(300, rawMonthly) * planMult;

  const prorated = pickupDate ? calculateProration(pickupDate, monthlyRate) : null;

  const [billing, setBilling] = useState({ transport: 0, packing: 0, advancePaid: 0, notes: '' });

  const netDue = (billing.transport + billing.packing + (prorated?.proratedAmount || 0)) - billing.advancePaid;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // 1. Create storage record
      const storResult = await addStorage({
        customerId, customerName,
        warehouse: loc.warehouse, row: loc.row, section: loc.section, location: location3D,
        plan: loc.plan, storageType: loc.storageType, insuranceOpted: loc.insuranceOpted,
        startDate: pickupDate || new Date().toISOString().split('T')[0],
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        monthlyRate, status: 'Active', notes: billing.notes,
      });
      const storageId = storResult.id || `AVT-STO-${Date.now()}`;

      // 2. Add items (with AVT-ITEM IDs)
      await addStoredItems(items.map((it, idx) => ({
        customerId, storageId,
        id: `AVT-ITEM-${String(idx + 1).padStart(4, '0')}`,
        itemDefId: it.itemDefId, name: it.name, category: it.category,
        description: it.description, options: JSON.stringify(it.options),
        quantity: it.quantity, unit: it.unit || 'unit',
        condition: it.condition || 'Good', status: 'In Storage',
        isExtra: it.isExtra, notes: it.notes, addedAt: new Date().toISOString().split('T')[0],
      })));

      // 3. Create first invoice payment
      if (netDue > 0) {
        await addPayment({
          customerId, type: 'Monthly Storage',
          amount: netDue, gstAmount: Math.round(netDue * 0.18), totalAmount: Math.round(netDue * 1.18),
          dueDate: pickupDate, status: 'Pending',
          description: `First invoice: Transport + Packing + Storage (${prorated?.days} days) − Advance`,
          billingPeriod: prorated ? `${pickupDate} to ${prorated.nextBillingDate}` : '',
        });
      }

      // 4. Update customer status to Stored
      await updateCustomer({ id: customerId, status: 'Stored', storageId });

      setSaved(true);
      setTimeout(() => navigate('/admin/customers'), 2000);
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storage Setup</h1>
          {customerName && <p className="text-sm text-brand-gold font-medium">{customerId} — {customerName}</p>}
        </div>
      </div>

      {/* Step bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg flex-1 transition-all text-xs font-semibold',
                step === s.id ? 'bg-brand-dark text-white' : step > s.id ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400')}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* ── Step 1: Storage Location ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-900">Warehouse Assignment</h3>

            <div className="bg-brand-dark/5 border border-brand-dark/10 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Storage Location</p>
              <p className="text-3xl font-black text-brand-dark tracking-widest">{location3D}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Warehouse">
                <div className="grid gap-2">
                  {WAREHOUSES.map(w => (
                    <button key={w} onClick={() => setLoc(p => ({ ...p, warehouse: w }))}
                      className={clsx('py-2 rounded-xl border-2 text-sm font-bold transition-all',
                        loc.warehouse === w ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                      {w}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Row">
                <div className="grid grid-cols-2 gap-2">
                  {WAREHOUSE_ROWS.map(r => (
                    <button key={r} onClick={() => setLoc(p => ({ ...p, row: r }))}
                      className={clsx('py-2 rounded-xl border-2 text-sm font-bold transition-all',
                        loc.row === r ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-600')}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Section">
                <div className="grid grid-cols-2 gap-2">
                  {WAREHOUSE_SECTIONS.map(s => (
                    <button key={s} onClick={() => setLoc(p => ({ ...p, section: s }))}
                      className={clsx('py-2 rounded-xl border-2 text-sm font-bold transition-all',
                        loc.section === s ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-600')}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Storage Plan">
              <div className="grid grid-cols-3 gap-3">
                {PLANS.map(p => (
                  <button key={p.id} onClick={() => setLoc(prev => ({ ...prev, plan: p.id as StoragePlan }))}
                    className={clsx('p-3 rounded-xl border-2 text-left transition-all',
                      loc.plan === p.id ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200 hover:border-gray-300')}>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">×{p.mult}</p>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Storage Type">
              <div className="grid grid-cols-3 gap-2">
                {STORAGE_TYPES.map(t => (
                  <button key={t} onClick={() => setLoc(p => ({ ...p, storageType: t as StorageType }))}
                    className={clsx('py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all',
                      loc.storageType === t ? 'border-brand-gold bg-brand-gold/10 text-brand-dark' : 'border-gray-200 text-gray-600')}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <label className={clsx('flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
              loc.insuranceOpted ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200')}>
              <input type="checkbox" className="w-4 h-4 accent-brand-gold" checked={loc.insuranceOpted}
                onChange={e => setLoc(p => ({ ...p, insuranceOpted: e.target.checked }))} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Insurance Opted</p>
                <p className="text-xs text-gray-500">Coverage for stored items</p>
              </div>
            </label>
          </div>
        )}

        {/* ── Step 2: Item Catalogue ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add Items to Storage</h3>
              <span className="text-sm text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} items · ₹{monthlyRate.toLocaleString()}/mo</span>
            </div>
            <ItemCatalogue items={items} onChange={setItems} />
          </div>
        )}

        {/* ── Step 3: Billing ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-900">Billing Finalization</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Transportation Charges (₹)">
                <input className={inp} type="number" min={0} value={billing.transport}
                  onChange={e => setBilling(p => ({ ...p, transport: Number(e.target.value) }))} />
              </Field>
              <Field label="Packing Charges (₹)">
                <input className={inp} type="number" min={0} value={billing.packing}
                  onChange={e => setBilling(p => ({ ...p, packing: Number(e.target.value) }))} />
              </Field>
            </div>
            <Field label="Advance Already Received (₹)">
              <input className={inp} type="number" min={0} value={billing.advancePaid}
                onChange={e => setBilling(p => ({ ...p, advancePaid: Number(e.target.value) }))} />
            </Field>

            {prorated && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-blue-900">📅 First Month Proration</p>
                <p className="text-xs text-blue-700">Pickup: <strong>{pickupDate}</strong> → Next billing on <strong>{prorated.nextBillingDate}</strong> ({prorated.days} days)</p>
                <p className="text-sm font-bold text-blue-900">Prorated Amount: ₹{prorated.proratedAmount.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Formula: ₹{monthlyRate.toLocaleString()} ÷ {prorated.daysInMonth} days × {prorated.days} days</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-gray-700 mb-3">Invoice Summary</p>
              <RRow label="Transportation" value={`₹${billing.transport.toLocaleString()}`} />
              <RRow label="Packing" value={`₹${billing.packing.toLocaleString()}`} />
              <RRow label={`Storage (${prorated?.days || 0} days prorated)`} value={`₹${prorated?.proratedAmount.toLocaleString() || 0}`} />
              <RRow label="Advance Paid (deducted)" value={`− ₹${billing.advancePaid.toLocaleString()}`} />
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-900">Net Amount Due</span>
                <span className="font-black text-xl text-brand-dark">₹{Math.max(0, netDue).toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">+ 18% GST = ₹{Math.max(0, Math.round(netDue * 1.18)).toLocaleString()}</p>
            </div>
            <p className="text-xs text-gray-500">💡 From {prorated?.nextBillingDate}, monthly charge of ₹{monthlyRate.toLocaleString()} will apply on the 5th of each month.</p>
          </div>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Confirm & Activate Storage</h3>
            {saved ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-bold">Storage Activated!</p>
                <p className="text-sm text-gray-500 mt-1">All items logged. Customer status updated to Stored.</p>
              </div>
            ) : (
              <>
                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <RRow label="Location" value={location3D} />
                  <RRow label="Plan" value={PLANS.find(p => p.id === loc.plan)?.name} />
                  <RRow label="Storage Type" value={loc.storageType} />
                  <RRow label="Insurance" value={loc.insuranceOpted ? 'Yes' : 'No'} />
                  <RRow label="Total Items" value={items.reduce((s, i) => s + i.quantity, 0)} />
                  <RRow label="Monthly Rate" value={`₹${monthlyRate.toLocaleString()}`} />
                  <RRow label="Net Due (first invoice)" value={`₹${Math.max(0, netDue).toLocaleString()}`} />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-semibold">✅ After saving:</p>
                  <ul className="text-xs mt-1 space-y-0.5">
                    <li>• Storage ID (AVT-STO-XXXX) created</li>
                    <li>• Item IDs (AVT-ITEM-0001…) assigned</li>
                    <li>• First invoice (AVT-PAY-XXXX) generated</li>
                    <li>• Customer status → Stored</li>
                    <li>• Customer portal unlocked with all details</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!saved && (
        <div className="flex justify-between items-center bg-white rounded-xl border border-gray-200 px-6 py-4">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 2 && items.length === 0}
              className="flex items-center gap-2 bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-dark/90 disabled:opacity-40 transition-all">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-brand-gold text-brand-dark px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-gold/90 disabled:opacity-60 shadow-md transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {saving ? 'Activating...' : 'Activate Storage'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
