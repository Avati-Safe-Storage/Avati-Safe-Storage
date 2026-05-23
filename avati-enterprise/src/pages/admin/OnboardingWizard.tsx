import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User, Truck, KeyRound,
  CheckCircle2, ChevronLeft, ChevronRight, Loader2, Copy, Eye, EyeOff,
} from 'lucide-react';
import clsx from 'clsx';
import { addPickup, addPayment, getStaff } from '../../lib/googleSheets';
import type { PreferredTime, Staff } from '../../lib/googleSheets';
import { useZohoAuth } from '../../hooks/useZohoAuth';
import { ZohoApi } from '../../lib/zoho/zohoApi';
import type { Lead } from '../../lib/zoho/zohoTypes';

type KycType = 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License' | 'GSTIN';

const STEPS = [
  { id: 1, label: 'Customer Details', icon: User },
  { id: 2, label: 'Schedule Pickup', icon: Truck },
  { id: 3, label: 'Portal Login', icon: KeyRound },
  { id: 4, label: 'Confirm', icon: CheckCircle2 },
];

const KYC_TYPES: KycType[] = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'GSTIN'];
const STATES = ['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan', 'Kerala', 'Other'];
const TIMES: PreferredTime[] = ['Morning (9am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–7pm)'];

function genPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
  return 'Avt@' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function genLoginId(name: string) {
  const first = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
  return `avt.${first}@avati.in`;
}

const inputCls = 'w-full px-3.5 py-2.5 vault-input rounded-xl text-sm placeholder:text-brand-muted/30 focus:outline-none';
const selectCls = inputCls + ' appearance-none cursor-pointer bg-[url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%253E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.875rem_center] bg-no-repeat pr-10';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-muted mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | number | boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-white/5 last:border-0 text-sm">
      <span className="text-brand-muted">{label}</span>
      <span className="font-bold text-brand-text text-right max-w-[55%] truncate">{String(value)}</span>
    </div>
  );
}

export default function OnboardingWizard() {
  const location = useLocation();
  const navigate = useNavigate();
  const lead: Lead | undefined = location.state?.lead;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  // ── Step 1: Customer Details ──
  const [cust, setCust] = useState({
    name: lead?.name || '',
    company: '',
    phone: lead?.phone || '',
    altPhone: '',
    email: lead?.email || '',
    kycType: 'PAN' as KycType,
    kycId: '',
    gstin: '',
    startDate: new Date().toISOString().split('T')[0],
    insuranceRequired: false,
    state: 'Karnataka',
    notes: '',
  });

  // ── Step 2: Pickup ──
  const [pickup, setPickup] = useState({
    address: '',
    floor: '',
    liftAvailable: true,
    pickupDate: lead?.pickupDate || '',
    preferredTime: 'Morning (9am–12pm)' as PreferredTime,
    advanceAmount: 2000,
    staffIds: [] as string[],
    vehicleNumber: '',
    notes: '',
  });

  // ── Step 3: Login ──
  const [login, setLogin] = useState({ loginId: '', password: '' });

  useEffect(() => {
    getStaff().then(setStaff);
  }, []);

  useEffect(() => {
    if (cust.name) {
      setLogin(prev => ({
        loginId: prev.loginId || genLoginId(cust.name),
        password: prev.password || genPassword(),
      }));
    }
  }, [cust.name]);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const canNext = () => {
    if (step === 1) return cust.name && cust.phone && cust.email && cust.kycId;
    if (step === 2) return pickup.address && pickup.pickupDate && pickup.floor;
    if (step === 3) return login.loginId && login.password;
    return true;
  };

  const { getValidToken } = useZohoAuth();
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const zohoApi = new ZohoApi(getValidToken);
      const selectedStaff = staff.filter(s => pickup.staffIds.includes(s.id));
      const staffNames = selectedStaff.map(s => s.name).join(', ');
      const vehicle = selectedStaff.find(s => s.vehicleNumber)?.vehicleNumber || pickup.vehicleNumber;

      // Phase B Action: Generate AVT-CUST ID
      const customerId = `AVT-CUST-${Math.floor(1000 + Math.random() * 9000)}`;

      // Phase B Action: Convert Lead to Contact in Zoho
      if (lead?.zohoId) {
        await zohoApi.convertLeadToCustomer(lead.zohoId, customerId);
      }

      // Phase B Action: Generate Digital Form & Zoho Sign
      await zohoApi.sendRentalAgreement({
        id: customerId, name: cust.name, phone: cust.phone, email: cust.email,
        status: 'Identity Verification Pending',
        kycType: cust.kycType, kycId: cust.kycId, gstin: cust.gstin, createdAt: new Date().toISOString()
      });

      // Maintain legacy Pickup & Payment routines for now (to be migrated in Phase C/D)
      const payResult = await addPayment({
        customerId, type: 'Advance', amount: pickup.advanceAmount,
        gstAmount: 0, totalAmount: pickup.advanceAmount, paidOn: new Date().toISOString().split('T')[0],
        status: 'Paid', description: 'Advance payment at pickup booking',
      });

      await addPickup({
        customerId, customerName: cust.name, address: pickup.address, floor: pickup.floor,
        liftAvailable: pickup.liftAvailable, pickupDate: pickup.pickupDate,
        preferredTime: pickup.preferredTime, advanceAmount: pickup.advanceAmount,
        advancePaymentId: payResult.id, staffNames, vehicleNumber: vehicle || '',
        labours: String(selectedStaff.filter(s => s.role === 'Labour').length),
        status: 'Scheduled', notes: pickup.notes,
      });

      setSaved(true);
      setTimeout(() => navigate('/admin/customers'), 2000);
    } catch (e: any) {
      setError(e.message || 'Zoho CRM Conversion failed. Please check credentials.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-muted hover:text-brand-gold transition-colors border border-white/5">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-brand-text uppercase tracking-wider">Customer Onboarding</h1>
          {lead && <p className="text-sm text-brand-gold font-bold mt-0.5">Converting Lead: {lead.id} — {lead.name}</p>}
        </div>
      </div>

      {/* Step Bar */}
      <div className="vault-glass rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id, active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={clsx('flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 transition-all border',
                  active ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] ring-1 ring-brand-gold/30' 
                  : done ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' 
                  : 'bg-white/5 border-white/5 text-brand-muted/40'
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold tracking-wide">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-brand-muted/30 hidden sm:block flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="vault-glass rounded-xl p-6">

        {/* ── Step 1: Customer Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-brand-gold flex items-center gap-2 text-base uppercase tracking-wide">
              <User className="w-5 h-5 text-brand-gold" /> Customer Details
            </h3>
            {lead && (
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
                📋 Auto-filled from lead <strong>{lead.id}</strong>. Please verify and complete missing fields.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input className={inputCls} placeholder="Rahul Mehta" value={cust.name}
                  onChange={e => setCust(p => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Company / Organisation">
                <input className={inputCls} placeholder="Acme Corp Pvt. Ltd." value={cust.company}
                  onChange={e => setCust(p => ({ ...p, company: e.target.value }))} />
              </Field>
              <Field label="Primary Phone" required>
                <input className={inputCls} placeholder="+91 98765 43210" type="tel" value={cust.phone}
                  onChange={e => setCust(p => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label="Alternate Phone">
                <input className={inputCls} placeholder="+91 87654 32109" type="tel" value={cust.altPhone}
                  onChange={e => setCust(p => ({ ...p, altPhone: e.target.value }))} />
              </Field>
              <Field label="Email Address" required>
                <input className={inputCls} placeholder="customer@email.com" type="email" value={cust.email}
                  onChange={e => setCust(p => ({ ...p, email: e.target.value }))} />
              </Field>
              <Field label="Start Date">
                <input className={inputCls} type="date" value={cust.startDate}
                  onChange={e => setCust(p => ({ ...p, startDate: e.target.value }))} />
              </Field>
              <Field label="KYC Document Type">
                <select className={selectCls} value={cust.kycType}
                  onChange={e => setCust(p => ({ ...p, kycType: e.target.value as KycType }))}>
                  {KYC_TYPES.map(t => <option key={t} className="bg-brand-dark text-brand-text">{t}</option>)}
                </select>
              </Field>
              <Field label="KYC ID Number" required>
                <input className={inputCls} placeholder={cust.kycType === 'Aadhaar' ? '1234-5678-9012' : 'ABCDE1234F'}
                  value={cust.kycId} onChange={e => setCust(p => ({ ...p, kycId: e.target.value.toUpperCase() }))} />
              </Field>
              <Field label="GSTIN (optional)">
                <input className={inputCls} placeholder="29ABCDE1234F1ZK" maxLength={15}
                  value={cust.gstin} onChange={e => setCust(p => ({ ...p, gstin: e.target.value.toUpperCase() }))} />
              </Field>
              <Field label="State">
                <select className={selectCls} value={cust.state}
                  onChange={e => setCust(p => ({ ...p, state: e.target.value }))}>
                  {STATES.map(s => <option key={s} className="bg-brand-dark text-brand-text">{s}</option>)}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:border-brand-gold/30 hover:bg-white/10 transition-all">
              <input type="checkbox" className="w-4 h-4 accent-brand-gold cursor-pointer" checked={cust.insuranceRequired}
                onChange={e => setCust(p => ({ ...p, insuranceRequired: e.target.checked }))} />
              <div>
                <p className="text-sm font-bold text-brand-text">Insurance Required</p>
                <p className="text-xs text-brand-muted">Cover items stored in our facility for extra peace of mind</p>
              </div>
            </label>
            <Field label="Notes">
              <textarea className={inputCls + ' resize-none'} rows={2}
                placeholder="Special requirements..." value={cust.notes}
                onChange={e => setCust(p => ({ ...p, notes: e.target.value }))} />
            </Field>
          </div>
        )}

        {/* ── Step 2: Schedule Pickup ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-brand-gold flex items-center gap-2 text-base uppercase tracking-wide">
              <Truck className="w-5 h-5 text-brand-gold" /> Schedule Pickup
            </h3>
            <Field label="Pickup Address" required>
              <textarea className={inputCls + ' resize-none'} rows={2}
                placeholder="Flat/Door No., Street, Area, City" value={pickup.address}
                onChange={e => setPickup(p => ({ ...p, address: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Floor" required>
                <input className={inputCls} placeholder="e.g. 3rd Floor, Ground" value={pickup.floor}
                  onChange={e => setPickup(p => ({ ...p, floor: e.target.value }))} />
              </Field>
              <Field label="Lift Available">
                <div className="flex gap-3 mt-1">
                  {[true, false].map(v => (
                    <label key={String(v)} className={clsx('flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm font-bold transition-all',
                      pickup.liftAvailable === v ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]' : 'border-white/5 bg-white/5 text-brand-muted/50 hover:border-white/10')}>
                      <input type="radio" className="sr-only" checked={pickup.liftAvailable === v}
                        onChange={() => setPickup(p => ({ ...p, liftAvailable: v }))} />
                      {v ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pickup Date" required>
                <input className={inputCls} type="date" value={pickup.pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setPickup(p => ({ ...p, pickupDate: e.target.value }))} />
              </Field>
              <Field label="Preferred Time">
                <select className={selectCls} value={pickup.preferredTime}
                  onChange={e => setPickup(p => ({ ...p, preferredTime: e.target.value as PreferredTime }))}>
                  {TIMES.map(t => <option key={t} className="bg-brand-dark text-brand-text">{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label={`Advance Amount: ₹${pickup.advanceAmount.toLocaleString()}`}>
              <div className="space-y-2">
                <input type="range" min={1000} max={5000} step={500} value={pickup.advanceAmount}
                  onChange={e => setPickup(p => ({ ...p, advanceAmount: Number(e.target.value) }))}
                  className="w-full accent-brand-gold cursor-pointer" />
                <div className="flex justify-between text-xs text-brand-muted/40 font-bold">
                  <span>₹1,000</span><span>₹5,000</span>
                </div>
                <p className="text-xs text-brand-muted">Will be adjusted against final transportation and packing charges.</p>
              </div>
            </Field>

            {/* Staff Assignment */}
            {staff.length > 0 && (
              <Field label="Assign Staff">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {staff.map(s => (
                    <label key={s.id} className={clsx('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      pickup.staffIds.includes(s.id) ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_10px_rgba(212,175,55,0.05)]' : 'border-white/5 bg-white/5 hover:border-white/10',
                      !s.available && 'opacity-35 cursor-not-allowed'
                    )}>
                      <input type="checkbox" disabled={!s.available} className="w-4 h-4 accent-brand-gold cursor-pointer"
                        checked={pickup.staffIds.includes(s.id)}
                        onChange={e => setPickup(p => ({
                          ...p, staffIds: e.target.checked ? [...p.staffIds, s.id] : p.staffIds.filter(id => id !== s.id)
                        }))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-text truncate">{s.name}</p>
                        <p className="text-xs text-brand-muted">{s.role}{s.vehicleNumber ? ` · ${s.vehicleNumber}` : ''}</p>
                      </div>
                      {!s.available && <span className="text-xs text-red-400 font-medium">Unavailable</span>}
                    </label>
                  ))}
                </div>
              </Field>
            )}

            <Field label="Vehicle Number (if not assigned via staff)">
              <input className={inputCls} placeholder="KA-01-AB-1234" value={pickup.vehicleNumber}
                onChange={e => setPickup(p => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))} />
            </Field>
            <Field label="Notes">
              <textarea className={inputCls + ' resize-none'} rows={2}
                placeholder="Special pickup instructions..." value={pickup.notes}
                onChange={e => setPickup(p => ({ ...p, notes: e.target.value }))} />
            </Field>
          </div>
        )}

        {/* ── Step 3: Portal Login ── */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-brand-gold flex items-center gap-2 text-base uppercase tracking-wide">
              <KeyRound className="w-5 h-5 text-brand-gold" /> Customer Portal Login
            </h3>
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300">
              <p className="font-bold mb-1">⚠️ Share these credentials with the customer</p>
              <p className="text-xs">These will be saved to Google Sheets. Share them securely via WhatsApp or email.</p>
            </div>
            <Field label="Login ID">
              <div className="relative">
                <input className={inputCls + ' pr-10'} value={login.loginId}
                  onChange={e => setLogin(p => ({ ...p, loginId: e.target.value }))} />
                <button onClick={() => copy(login.loginId, 'loginId')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedField === 'loginId' && <p className="text-xs text-emerald-400 font-bold mt-1">Copied Login ID!</p>}
            </Field>
            <Field label="Temporary Password">
              <div className="relative">
                <input className={inputCls + ' pr-20'} type={showPassword ? 'text' : 'password'}
                  value={login.password} onChange={e => setLogin(p => ({ ...p, password: e.target.value }))} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={() => setShowPassword(p => !p)} className="p-1.5 text-brand-muted hover:text-brand-gold">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copy(login.password, 'password')} className="p-1.5 text-brand-muted hover:text-brand-gold">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {copiedField === 'password' && <p className="text-xs text-emerald-400 font-bold mt-1">Copied Password!</p>}
              <button onClick={() => setLogin(p => ({ ...p, password: genPassword() }))}
                className="mt-2.5 text-xs text-brand-gold font-bold hover:underline flex items-center gap-1">
                🔄 Generate new password
              </button>
            </Field>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">Customer will see after login:</p>
              <ul className="text-sm text-brand-muted space-y-1.5">
                <li className="flex items-center gap-2 text-emerald-400/95"><span className="text-emerald-500 font-bold">✓</span> Pickup date, time, staff names & vehicle</li>
                <li className="flex items-center gap-2 text-emerald-400/95"><span className="text-emerald-500 font-bold">✓</span> Storage location & plan details</li>
                <li className="flex items-center gap-2 text-emerald-400/95"><span className="text-emerald-500 font-bold">✓</span> All item IDs and photos</li>
                <li className="flex items-center gap-2 text-emerald-400/95"><span className="text-emerald-500 font-bold">✓</span> Payment history & upcoming dues</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="font-bold text-brand-gold flex items-center gap-2 text-base uppercase tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-brand-gold" /> Confirm & Save
            </h3>
            {saved ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/35 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-brand-text uppercase tracking-wider">Customer Onboarded!</p>
                <p className="text-sm text-brand-muted mt-1">Saved to Google Sheets. Redirecting…</p>
              </div>
            ) : (
              <>
                {error && <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3">Customer</p>
                    <ReviewRow label="Name" value={cust.name} />
                    <ReviewRow label="Company" value={cust.company} />
                    <ReviewRow label="Phone" value={cust.phone} />
                    <ReviewRow label="Email" value={cust.email} />
                    <ReviewRow label="KYC" value={`${cust.kycType}: ${cust.kycId}`} />
                    <ReviewRow label="Insurance" value={cust.insuranceRequired ? 'Yes' : 'No'} />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3">Pickup</p>
                    <ReviewRow label="Date" value={pickup.pickupDate} />
                    <ReviewRow label="Time" value={pickup.preferredTime} />
                    <ReviewRow label="Address" value={pickup.address} />
                    <ReviewRow label="Floor" value={pickup.floor} />
                    <ReviewRow label="Lift" value={pickup.liftAvailable ? 'Yes' : 'No'} />
                    <ReviewRow label="Advance" value={`₹${pickup.advanceAmount.toLocaleString()}`} />
                  </div>
                </div>
                <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-4 text-brand-text">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3">Portal Login</p>
                  <ReviewRow label="Login ID" value={login.loginId} />
                  <ReviewRow label="Password" value="••••••••" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!saved && (
        <div className="flex justify-between items-center vault-glass rounded-xl px-6 py-4">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold font-bold transition-colors">
            <ChevronLeft className="w-4 h-4" /> {step === 1 ? 'Back to Leads' : 'Back'}
          </button>
          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-brand-text px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 vault-btn-gold px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-all cursor-pointer">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Confirm Onboarding'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
