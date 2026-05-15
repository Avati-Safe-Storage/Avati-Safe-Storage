import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Truck, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getPickups, completePickup } from '../../lib/googleSheets';
import type { Pickup, PickupStatus } from '../../lib/googleSheets';

const STATUS: Record<PickupStatus, string> = {
  'Scheduled':   'bg-blue-100 text-blue-800',
  'In Progress': 'bg-orange-100 text-orange-800',
  'Completed':   'bg-green-100 text-green-800',
  'Cancelled':   'bg-red-100 text-red-800',
};

export default function PickupManagement() {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PickupStatus | 'All'>('All');
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    getPickups().then(d => { setPickups(d); setLoading(false); });
  }, []);

  const filtered = pickups.filter(p => filter === 'All' || p.status === filter);

  const handleComplete = async (p: Pickup) => {
    if (!confirm(`Mark pickup ${p.id} as Completed?`)) return;
    setCompleting(p.id);
    await completePickup(p.id, p.customerId);
    setPickups(prev => prev.map(pk => pk.id === p.id ? { ...pk, status: 'Completed' } : pk));
    setCompleting(null);
  };

  const handleSetupStorage = (p: Pickup) => {
    navigate('/admin/storage-setup', {
      state: { customerId: p.customerId, customerName: p.customerName, pickupDate: p.pickupDate },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pickup Management</h1>
          <p className="text-gray-500 mt-1">{filtered.length} pickups</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              filter === s ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50')}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">{p.id}</span>
                    <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', STATUS[p.status])}>{p.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{p.customerName || p.customerId}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />{p.pickupDate}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />{p.preferredTime}</span>
                    <span className="flex items-center gap-1.5 col-span-2"><MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{p.address}, {p.floor}</span>
                    {p.staffNames && <span className="flex items-center gap-1.5 col-span-2"><User className="w-4 h-4 text-gray-400" />{p.staffNames}</span>}
                    {p.vehicleNumber && <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-gray-400" />{p.vehicleNumber}</span>}
                    <span className="flex items-center gap-1.5">Lift: {p.liftAvailable ? '✅ Yes' : '❌ No'}</span>
                    <span className="font-semibold text-brand-dark">Advance: ₹{p.advanceAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {p.status === 'Scheduled' && (
                    <button onClick={() => handleComplete(p)} disabled={completing === p.id}
                      className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-all disabled:opacity-50">
                      {completing === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Mark Completed
                    </button>
                  )}
                  {p.status === 'Completed' && (
                    <button onClick={() => handleSetupStorage(p)}
                      className="flex items-center gap-1.5 bg-brand-dark text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-brand-dark/90 transition-all">
                      Setup Storage <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No {filter !== 'All' ? filter.toLowerCase() : ''} pickups found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
