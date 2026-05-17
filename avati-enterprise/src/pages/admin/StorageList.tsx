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
          <h1 className="text-2xl font-bold text-gray-900">Storage Records</h1>
          <p className="text-gray-500 mt-1">{list.length} active storage units</p>
        </div>
      </div>

      {/* Warehouse summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {['WH1', 'WH2', 'WH3'].map(wh => {
          const count = list.filter(s => s.warehouse === wh && s.status === 'Active').length;
          return (
            <div key={wh} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Warehouse className="w-8 h-8 mx-auto mb-2 text-brand-gold" />
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">{wh} Active Units</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Storage ID</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Monthly</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Insurance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-sm text-brand-gold font-bold">{s.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-gray-900">{s.customerName}</p>
                    <p className="text-xs text-gray-400">{s.customerId}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-brand-dark text-brand-gold font-bold text-sm px-3 py-1 rounded-lg tracking-widest">
                      {s.location}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm capitalize text-gray-700">
                    {PLANS.find(p => p.id === s.plan)?.name || s.plan}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{s.storageType}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{s.itemCount}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">₹{s.monthlyRate.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('text-xs font-bold px-2 py-1 rounded-full',
                      s.status === 'Active' ? 'bg-green-100 text-green-800' :
                      s.status === 'Vacating' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600')}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm">{s.insuranceOpted ? '✅' : '—'}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
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
