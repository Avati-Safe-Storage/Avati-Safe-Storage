import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Warehouse, Package, CreditCard, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { getPickups, getStorageList, getStoredItems, getPayments } from '../../lib/googleSheets';
import type { Pickup, Storage, StoredItem, Payment } from '../../lib/googleSheets';
import { PLANS } from '../../lib/inventoryData';

function InfoCard({ title, icon: Icon, children, className }: { title: string; icon: any; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('vault-glass rounded-2xl p-5 shadow-lg', className)}>
      <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-2.5">
        <Icon className="w-5 h-5 text-brand-gold" />
        <h2 className="font-extrabold text-brand-gold uppercase tracking-wider text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number | boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-white/5 last:border-0 text-sm">
      <span className="text-brand-muted font-medium">{label}</span>
      <span className="font-bold text-brand-text text-right max-w-[60%] truncate">{String(value)}</span>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [storage, setStorage] = useState<Storage | null>(null);
  const [items, setItems] = useState<StoredItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getPickups(),
      getStorageList(),
      getStoredItems(),
      getPayments(user.id),
    ]).then(([pickups, storages, allItems, pays]) => {
      setPickup(pickups.find(p => p.customerId === user.id) || null);
      const stor = storages.find(s => s.customerId === user.id) || null;
      setStorage(stor);
      setItems(allItems.filter(i => i.customerId === user.id));
      setPayments(pays);
      setLoading(false);
    });
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
  );

  const nextPayment = payments.find(p => p.status === 'Pending' || p.status === 'Overdue');
  const planName = storage ? (PLANS.find(p => p.id === storage.plan)?.name || storage.plan) : null;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#0a0a0c] to-[#121214] border border-[#D4AF37]/15 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none"></div>
        <p className="text-brand-gold text-[10px] font-black uppercase tracking-widest mb-1.5">Avati Vault Gateway</p>
        <h1 className="text-2xl font-black text-brand-text uppercase tracking-wide">{user?.name || 'Customer'}</h1>
        <p className="text-brand-muted text-xs font-bold mt-1.5 flex items-center gap-2">
          <span>{user?.id}</span>
          <span className="text-brand-muted/30">|</span>
          <span className={clsx(
            "font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border",
            storage?.status === 'Active' 
              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' 
              : pickup 
                ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold' 
                : 'bg-white/5 border-white/5 text-brand-muted'
          )}>
            {storage?.status === 'Active' ? 'Storage Active' : pickup ? 'Pickup Scheduled' : 'Onboarding'}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pickup Details */}
        {pickup && (
          <InfoCard title="Pickup Details" icon={Calendar}>
            <div className="space-y-0">
              <Row label="Pickup ID" value={pickup.id} />
              <Row label="Date" value={pickup.pickupDate} />
              <Row label="Time" value={pickup.preferredTime} />
              <Row label="Status" value={pickup.status} />
              <Row label="Address" value={pickup.address} />
              <Row label="Floor" value={pickup.floor} />
              <Row label="Lift Available" value={pickup.liftAvailable ? 'Yes' : 'No'} />
              {pickup.staffNames && <Row label="Staff Attending" value={pickup.staffNames} />}
              {pickup.vehicleNumber && <Row label="Vehicle" value={pickup.vehicleNumber} />}
              {pickup.labours && <Row label="No. of Labours" value={pickup.labours} />}
              <Row label="Advance Paid" value={`₹${pickup.advanceAmount.toLocaleString()}`} />
            </div>
          </InfoCard>
        )}

        {/* Storage Details */}
        {storage ? (
          <InfoCard title="Storage Details" icon={Warehouse}>
            <div className="bg-brand-dark border border-white/5 rounded-xl p-4 text-center mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1">Your Storage Location</p>
              <p className="text-3xl font-black text-brand-gold tracking-widest">{storage.location}</p>
            </div>
            <div className="space-y-0">
              <Row label="Storage ID" value={storage.id} />
              <Row label="Plan" value={planName || undefined} />
              <Row label="Type" value={storage.storageType} />
              <Row label="Insurance" value={storage.insuranceOpted ? 'Yes' : 'No'} />
              <Row label="Start Date" value={storage.startDate} />
              <Row label="Items Stored" value={storage.itemCount} />
              <Row label="Monthly Rate" value={`₹${storage.monthlyRate.toLocaleString()}`} />
            </div>
          </InfoCard>
        ) : (
          !pickup && (
            <InfoCard title="Storage Details" icon={Warehouse}>
              <div className="text-center py-8 text-brand-muted">
                <Warehouse className="w-10 h-10 mx-auto mb-2 opacity-35 text-brand-gold" />
                <p className="text-xs font-bold uppercase tracking-wide text-brand-muted/75">Storage details will appear after your pickup is completed.</p>
              </div>
            </InfoCard>
          )
        )}

        {/* Items summary */}
        <InfoCard title="Stored Items" icon={Package}>
          {items.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-black text-brand-text">{items.length}</span>
                <Link to="/portal/items" className="flex items-center gap-1 text-xs text-brand-gold font-bold hover:underline">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {items.slice(0, 4).map(it => (
                <div key={it.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-bold text-brand-text truncate">{it.name}</p>
                    <p className="text-[10px] text-brand-muted/50 font-mono">{it.id}</p>
                  </div>
                  <span className="text-[11px] bg-white/5 text-brand-muted px-2.5 py-0.5 rounded-full border border-white/5 font-bold flex-shrink-0">{it.quantity} {it.unit}</span>
                </div>
              ))}
              {items.length > 4 && (
                <Link to="/portal/items" className="block text-center text-xs text-brand-gold font-bold hover:underline pt-2 border-t border-white/5">
                  +{items.length - 4} more items
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-brand-muted">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-35 text-brand-gold" />
              <p className="text-xs font-bold uppercase tracking-wide text-brand-muted/75">No items catalogued yet</p>
            </div>
          )}
        </InfoCard>

        {/* Next Payment */}
        <InfoCard title="Next Payment" icon={CreditCard}>
          {nextPayment ? (
            <div className="space-y-3.5">
              <div className={clsx('p-4 rounded-xl border', nextPayment.status === 'Overdue' ? 'border-red-500/20 bg-red-950/20' : 'border-amber-500/20 bg-amber-950/20')}>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className={clsx('font-black text-xs uppercase tracking-wider', nextPayment.status === 'Overdue' ? 'text-red-400' : 'text-amber-400')}>
                      {nextPayment.status === 'Overdue' ? '⚠️ Overdue!' : '📅 Due Soon'}
                    </p>
                    <p className="text-xs text-brand-text font-bold mt-1.5 truncate">{nextPayment.description}</p>
                    {nextPayment.dueDate && <p className="text-[11px] text-brand-muted mt-1 font-semibold">Due: {nextPayment.dueDate}</p>}
                    {nextPayment.billingPeriod && <p className="text-[10px] text-brand-muted/70">{nextPayment.billingPeriod}</p>}
                  </div>
                  <p className="text-xl font-black text-brand-text flex-shrink-0">₹{nextPayment.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <Link to="/portal/payments"
                className="block w-full text-center py-2.5 vault-btn-gold rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer">
                View All Payments
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-brand-muted">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">All payments up to date!</p>
              <Link to="/portal/payments" className="text-xs text-brand-gold font-bold hover:underline mt-2.5 block">
                View payment history
              </Link>
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
}
