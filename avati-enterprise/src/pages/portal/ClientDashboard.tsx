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
    <div className={clsx('bg-white rounded-2xl border border-gray-200 p-5 shadow-sm', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-brand-gold" />
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number | boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{String(value)}</span>
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
      <div className="bg-brand-dark rounded-2xl p-6 text-white">
        <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-1">Welcome back</p>
        <h1 className="text-2xl font-black">{user?.name || 'Customer'}</h1>
        <p className="text-gray-400 text-sm mt-1">{user?.id} · {storage?.status === 'Active' ? '🟢 Storage Active' : pickup ? '📦 Pickup Scheduled' : '⏳ Onboarding'}</p>
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
              <Row label="Lift Available" value={pickup.liftAvailable ? 'Yes ✅' : 'No ❌'} />
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
            <div className="bg-brand-dark rounded-xl p-4 text-center mb-4">
              <p className="text-xs text-gray-400 mb-1">Your Storage Location</p>
              <p className="text-4xl font-black text-brand-gold tracking-widest">{storage.location}</p>
            </div>
            <div className="space-y-0">
              <Row label="Storage ID" value={storage.id} />
              <Row label="Plan" value={planName || undefined} />
              <Row label="Type" value={storage.storageType} />
              <Row label="Insurance" value={storage.insuranceOpted ? 'Yes ✅' : 'No'} />
              <Row label="Start Date" value={storage.startDate} />
              <Row label="Items Stored" value={storage.itemCount} />
              <Row label="Monthly Rate" value={`₹${storage.monthlyRate.toLocaleString()}`} />
            </div>
          </InfoCard>
        ) : (
          !pickup && (
            <InfoCard title="Storage Details" icon={Warehouse}>
              <div className="text-center py-8 text-gray-400">
                <Warehouse className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Storage details will appear after your pickup is completed.</p>
              </div>
            </InfoCard>
          )
        )}

        {/* Items summary */}
        <InfoCard title="Stored Items" icon={Package}>
          {items.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-brand-dark">{items.length}</span>
                <Link to="/portal/items" className="flex items-center gap-1 text-xs text-brand-gold font-bold hover:underline">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {items.slice(0, 4).map(it => (
                <div key={it.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{it.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{it.id}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{it.quantity} {it.unit}</span>
                </div>
              ))}
              {items.length > 4 && (
                <Link to="/portal/items" className="block text-center text-xs text-gray-400 hover:text-brand-gold pt-1">
                  +{items.length - 4} more items
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No items catalogued yet</p>
            </div>
          )}
        </InfoCard>

        {/* Next Payment */}
        <InfoCard title="Next Payment" icon={CreditCard}>
          {nextPayment ? (
            <div className="space-y-3">
              <div className={clsx('p-4 rounded-xl border-2', nextPayment.status === 'Overdue' ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-amber-50')}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={clsx('font-bold text-sm', nextPayment.status === 'Overdue' ? 'text-red-800' : 'text-amber-800')}>
                      {nextPayment.status === 'Overdue' ? '⚠️ Overdue!' : '📅 Due Soon'}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{nextPayment.description}</p>
                    {nextPayment.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {nextPayment.dueDate}</p>}
                    {nextPayment.billingPeriod && <p className="text-xs text-gray-400">{nextPayment.billingPeriod}</p>}
                  </div>
                  <p className="text-xl font-black text-gray-900">₹{nextPayment.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <Link to="/portal/payments"
                className="block w-full text-center py-2.5 bg-brand-gold text-brand-dark font-bold rounded-xl text-sm hover:bg-brand-gold/90 transition-all">
                View All Payments
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="text-sm font-semibold text-green-700">All payments up to date!</p>
              <Link to="/portal/payments" className="text-xs text-brand-gold hover:underline mt-2 block">
                View payment history
              </Link>
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
}
