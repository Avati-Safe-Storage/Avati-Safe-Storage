import { useState, useEffect } from 'react';
import { Warehouse, Package, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { getStorageList } from '../../lib/googleSheets';
import type { Storage } from '../../lib/googleSheets';
import { PLANS } from '../../lib/inventoryData';

export default function StorageList() {

  const [list, setList] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStorageList().then(d => { setList(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Storage Records</h1>
          <p className="text-brand-muted mt-1">{list.length} active storage units</p>
        </div>
      </div>

      {/* Warehouse summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {['WH1', 'WH2', 'WH3'].map(wh => {
          const count = list.filter(s => s.warehouse === wh && s.status === 'Active').length;
          return (
            <div key={wh} className="vault-card rounded-xl p-4 text-center border border-brand-border/10 hover:border-brand-gold/30 transition-all duration-300">
              <Warehouse className="w-8 h-8 mx-auto mb-2 text-brand-gold" />
              <p className="text-2xl font-black text-brand-text">{count}</p>
              <p className="text-sm text-brand-muted">{wh} Active Units</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
      ) : (
        <div className="vault-glass rounded-xl overflow-hidden border border-brand-border/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c0c0e]/85 text-brand-muted text-sm border-b border-brand-border/20">
                <th className="px-5 py-3.5 font-semibold">Storage ID</th>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Location</th>
                <th className="px-5 py-3.5 font-semibold">Plan</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Items</th>
                <th className="px-5 py-3.5 font-semibold">Monthly</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Insurance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/10">
              {list.map(s => (
                <tr key={s.id} className="hover:bg-[#121214]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm text-brand-gold font-bold">{s.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-brand-text">{s.customerName}</p>
                    <p className="text-xs text-brand-muted/70">{s.customerId}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-brand-dark/40 text-brand-gold font-bold text-sm px-3 py-1 rounded-lg tracking-widest border border-brand-gold/15">
                      {s.location}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm capitalize text-brand-muted">
                    {PLANS.find(p => p.id === s.plan)?.name || s.plan}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-brand-muted">{s.storageType}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-brand-text">{s.itemCount}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-brand-text">₹{s.monthlyRate.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={clsx('text-xs font-bold px-2 py-1 rounded-full border',
                      s.status === 'Active' ? 'bg-green-950/45 text-green-400 border-green-800/30' :
                      s.status === 'Vacating' ? 'bg-orange-950/45 text-orange-400 border-orange-800/30' :
                      'bg-brand-light text-brand-muted border-brand-border/20')}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-brand-text">{s.insuranceOpted ? '✅' : '—'}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-brand-muted">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-brand-gold" />
                  <p>No storage records yet</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
