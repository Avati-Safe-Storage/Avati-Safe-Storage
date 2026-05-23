import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Truck, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getPickups, completePickup } from '../../lib/googleSheets';
import type { Pickup, PickupStatus } from '../../lib/googleSheets';

const STATUS: Record<PickupStatus, string> = {
  'Scheduled':   'bg-blue-950/45 text-blue-400 border border-blue-800/30',
  'In Progress': 'bg-orange-950/45 text-orange-400 border border-orange-800/30',
  'Completed':   'bg-green-950/45 text-green-400 border border-green-800/30',
  'Cancelled':   'bg-red-950/45 text-red-400 border border-red-800/30',
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
          <h1 className="text-2xl font-bold text-brand-text">Pickup Management</h1>
          <p className="text-brand-muted mt-1">{filtered.length} pickups</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
              filter === s ? 'bg-brand-gold text-brand-dark border-brand-gold font-bold shadow-lg shadow-brand-gold/15' : 'bg-[#0c0c0e]/80 text-brand-muted border-brand-border/40 hover:text-brand-text hover:bg-[#121214] hover:border-brand-border/80')}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(p => (
            <div key={p.id} className="vault-card rounded-xl p-5 border border-brand-border/10 hover:border-brand-gold/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-muted/70">{p.id}</span>
                    <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', STATUS[p.status])}>{p.status}</span>
                  </div>
                  <h3 className="font-bold text-brand-text text-lg">{p.customerName || p.customerId}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-brand-muted">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-gold/70" />{p.pickupDate}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-gold/70" />{p.preferredTime}</span>
                    <span className="flex items-center gap-1.5 col-span-2"><MapPin className="w-4 h-4 text-brand-gold/70 flex-shrink-0" />{p.address}, {p.floor}</span>
                    {p.staffNames && <span className="flex items-center gap-1.5 col-span-2"><User className="w-4 h-4 text-brand-gold/70" />{p.staffNames}</span>}
                    {p.vehicleNumber && <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-brand-gold/70" />{p.vehicleNumber}</span>}
                    <span className="flex items-center gap-1.5">Lift: {p.liftAvailable ? '✅ Yes' : '❌ No'}</span>
                    <span className="font-bold text-brand-gold">Advance: ₹{p.advanceAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {p.status === 'Scheduled' && (
                    <button onClick={() => handleComplete(p)} disabled={completing === p.id}
                      className="flex items-center gap-1.5 bg-green-900/60 text-green-300 border border-green-800/40 px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-850 hover:text-green-200 transition-all disabled:opacity-50 cursor-pointer">
                      {completing === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Mark Completed
                    </button>
                  )}
                  {p.status === 'Completed' && (
                    <button onClick={() => handleSetupStorage(p)}
                      className="flex items-center gap-1.5 vault-btn-gold text-black px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer">
                      Setup Storage <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-brand-muted bg-brand-surface rounded-xl border border-brand-border/15">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30 text-brand-gold" />
              <p>No {filter !== 'All' ? filter.toLowerCase() : ''} pickups found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
