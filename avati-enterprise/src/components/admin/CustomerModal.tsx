import { useState } from 'react';
import {
  X, ChevronRight, ChevronLeft, User, Phone, Mail, MapPin,
  Shield, Building2, IndianRupee, FileText, CheckCircle2, Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import type { Customer, KycType } from '../../lib/googleSheets';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<{ success: boolean }>;
  initial?: Customer | null;
}

const STEPS = [
  { id: 1, label: 'Personal Info',    icon: User },
  { id: 2, label: 'Contact Details', icon: Phone },
  { id: 3, label: 'KYC & Business',  icon: Shield },
  { id: 4, label: 'Storage Plan',    icon: Building2 },
  { id: 5, label: 'Review & Save',   icon: CheckCircle2 },
];

const KYC_TYPES: KycType[] = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'GSTIN'];
const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
const ZONES = ['Zone A – General Storage', 'Zone B – Climate Controlled', 'Zone C – High Value', 'Zone D – Bulk Items'];

const empty: Omit<Customer, 'id' | 'createdAt'> = {
  name: '', company: '', phone: '', altPhone: '', email: '',
  kycType: 'PAN', kycId: '', gstin: '', startDate: new Date().toISOString().split('T')[0],
  insuranceRequired: false, status: 'Onboarding',
  loginId: '', password: '', notes: '',
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all placeholder:text-gray-400";
const selectCls = inputCls + " appearance-none cursor-pointer";

export default function CustomerModal({ open, onClose, onSave, initial }: CustomerModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Omit<Customer, 'id' | 'createdAt'>>(initial || empty);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const set = (key: string, val: any) =>
    setData(prev => ({ ...prev, [key]: val }));

  const next = () => setStep(s => Math.min(s + 1, STEPS.length));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleClose = () => {
    setStep(1);
    setData(initial || empty);
    setSaved(false);
    setError('');
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const result = await onSave(data);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(handleClose, 1800);
    } else {
      setError('Failed to save. Make sure Google Sheets is configured.');
    }
  };

  const ReviewRow = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-brand-dark px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initial ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <p className="text-brand-gold text-xs mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
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
                      done  ? 'bg-brand-gold/20 text-brand-dark cursor-pointer hover:bg-brand-gold/30' :
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
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-gold" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input className={inputCls} placeholder="e.g. Rahul Mehta" value={data.name}
                    onChange={e => set('name', e.target.value)} />
                </Field>
                <Field label="Company / Organisation">
                  <input className={inputCls} placeholder="e.g. Acme Corp Pvt. Ltd." value={data.company || ''}
                    onChange={e => set('company', e.target.value)} />
                </Field>
              </div>
              <Field label="Status">
                <select className={selectCls} value={data.status} onChange={e => set('status', e.target.value)}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </Field>
              <Field label="Notes / Special Instructions">
                <textarea className={inputCls + ' resize-none'} rows={3}
                  placeholder="Any special requirements or notes about this customer..."
                  value={data.notes || ''} onChange={e => set('notes', e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── Step 2: Contact Details ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold" /> Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary Phone" required>
                  <input className={inputCls} placeholder="+91 98765 43210" type="tel" value={data.phone}
                    onChange={e => set('phone', e.target.value)} />
                </Field>
                <Field label="Alternate Phone">
                  <input className={inputCls} placeholder="+91 87654 32109" type="tel" value={data.alternateNumber || ''}
                    onChange={e => set('alternateNumber', e.target.value)} />
                </Field>
              </div>
              <Field label="Email Address" required>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input className={inputCls + ' pl-9'} placeholder="customer@example.com" type="email"
                    value={data.email} onChange={e => set('email', e.target.value)} />
                </div>
              </Field>
              <Field label="Street Address" required>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <textarea className={inputCls + ' pl-9 resize-none'} rows={2}
                    placeholder="Flat / Door No., Street, Locality"
                    value={data.address} onChange={e => set('address', e.target.value)} />
                </div>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City" required>
                  <input className={inputCls} placeholder="Bengaluru" value={data.city || ''}
                    onChange={e => set('city', e.target.value)} />
                </Field>
                <Field label="State">
                  <select className={selectCls} value={data.state || ''} onChange={e => set('state', e.target.value)}>
                    <option value="">Select</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Pincode">
                  <input className={inputCls} placeholder="560001" maxLength={6} value={data.pincode || ''}
                    onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 3: KYC & Business ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-gold" /> KYC & Business Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="KYC Document Type">
                  <select className={selectCls} value={data.kycType} onChange={e => set('kycType', e.target.value)}>
                    {KYC_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="KYC Document Number" required>
                  <input className={inputCls}
                    placeholder={data.kycType === 'Aadhaar' ? '1234-5678-9012' : data.kycType === 'PAN' ? 'ABCDE1234F' : 'Enter ID number'}
                    value={data.kycId || ''} onChange={e => set('kycId', e.target.value.toUpperCase())} />
                </Field>
              </div>
              <Field label="GSTIN (optional)">
                <input className={inputCls} placeholder="29ABCDE1234F1ZK" maxLength={15}
                  value={data.gstin || ''} onChange={e => set('gstin', e.target.value.toUpperCase())} />
              </Field>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">📁 Google Drive Folder</p>
                <p className="text-xs leading-relaxed">
                  A dedicated Drive folder will be automatically created for this customer when you save.
                  You can upload KYC documents, contracts, and item photos to that folder.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 4: Storage Plan ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-gold" /> Storage Plan & Assignment
              </h3>
              <Field label="Assigned Zone">
                <select className={selectCls} value={data.storageUnit || ''} onChange={e => set('storageUnit', e.target.value)}>
                  <option value="">-- Select a Zone --</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Monthly Rate (₹)">
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input className={inputCls + ' pl-9'} placeholder="5000" type="number"
                      value={data.monthlyRate || ''} onChange={e => set('monthlyRate', e.target.value)} />
                  </div>
                </Field>
                <Field label="Onboarding Date">
                  <input className={inputCls} type="date"
                    value={data.onboardingDate || new Date().toISOString().split('T')[0]}
                    onChange={e => set('onboardingDate', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Review & Confirm
              </h3>

              {saved ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">Customer Saved!</p>
                  <p className="text-sm text-gray-500 mt-1">Record added to Google Sheets and Drive folder created.</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5"><User className="w-3 h-3" /> Personal</p>
                      <ReviewRow label="Name" value={data.name} />
                      <ReviewRow label="Company" value={data.company} />
                      <ReviewRow label="Status" value={data.status} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Contact</p>
                      <ReviewRow label="Phone" value={data.phone} />
                      <ReviewRow label="Email" value={data.email} />
                      <ReviewRow label="City" value={data.city} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5"><Shield className="w-3 h-3" /> KYC</p>
                      <ReviewRow label="Type" value={data.kycType} />
                      <ReviewRow label="ID" value={data.kycId} />
                      <ReviewRow label="GSTIN" value={data.gstin} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Storage</p>
                      <ReviewRow label="Zone" value={data.storageUnit} />
                      <ReviewRow label="Monthly Rate" value={data.monthlyRate ? `₹${data.monthlyRate}` : undefined} />
                      <ReviewRow label="Onboarding" value={data.onboardingDate} />
                    </div>
                  </div>
                  {data.notes && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-2">
                      <FileText className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">{data.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length ? (
              <button
                onClick={next}
                disabled={
                  (step === 1 && !data.name) ||
                  (step === 2 && (!data.phone || !data.email || !data.address || !data.city))
                }
                className="flex items-center gap-1.5 bg-brand-dark text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-brand-gold text-brand-dark px-6 py-2 rounded-xl text-sm font-bold hover:bg-brand-gold/90 disabled:opacity-60 transition-all shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving to Sheets...' : 'Save Customer'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
