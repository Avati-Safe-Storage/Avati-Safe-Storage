import { useState } from 'react';
import { Search, Filter, Truck } from 'lucide-react';

const clientItems = [
  { id: 'INV-1001', name: 'Office Chairs (10x)', category: 'Furniture', dateStored: '2023-10-15', status: 'Stored' },
  { id: 'INV-1002', name: 'Desktops (Dell) (5x)', category: 'Electronics', dateStored: '2023-10-15', status: 'Stored' },
  { id: 'INV-1008', name: 'Archived Documents 2022', category: 'Documents', dateStored: '2024-01-10', status: 'Stored' },
  { id: 'INV-1015', name: 'Conference Table', category: 'Furniture', dateStored: '2024-02-20', status: 'Retrieval Pending' },
];

export default function ClientInventory() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-text uppercase tracking-wider">My Inventory</h1>
          <p className="text-sm text-brand-muted mt-1">View and manage your stored items in Avati Vault.</p>
        </div>
        <button className="vault-btn-gold px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer">
          <Truck className="w-5 h-5" />
          Request Retrieval
        </button>
      </div>

      <div className="vault-glass rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-brand-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full pl-11 pr-4 py-2.5 vault-input rounded-xl text-sm focus:outline-none placeholder:text-brand-muted/30 focus:ring-1 focus:ring-brand-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-white/5 bg-white/5 rounded-xl text-sm font-bold text-brand-muted hover:text-brand-gold hover:bg-white/10 transition-colors w-full sm:w-auto justify-center cursor-pointer">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-brand-gold text-xs font-bold uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-4 font-extrabold w-12">
                  <input type="checkbox" className="accent-brand-gold cursor-pointer w-4 h-4" />
                </th>
                <th className="px-6 py-4 font-extrabold">Item Name</th>
                <th className="px-6 py-4 font-extrabold">Item ID</th>
                <th className="px-6 py-4 font-extrabold">Category</th>
                <th className="px-6 py-4 font-extrabold">Date Stored</th>
                <th className="px-6 py-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clientItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="accent-brand-gold cursor-pointer w-4 h-4" />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-text">{item.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-brand-muted/50">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-brand-muted">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-brand-muted">{item.dateStored}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                      ${item.status === 'Stored' 
                        ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-950/40 border-amber-500/20 text-amber-400'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
