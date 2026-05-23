import { useState } from 'react';
import { Search, Box, MapPin, Download, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useStoredItems, useCustomers, useSheetsConfig } from '../../hooks/useGoogleSheets';
import InventoryModal from '../../components/admin/InventoryModal';
import type { ItemStatus, StoredItem } from '../../lib/googleSheets';

const STATUS_COLORS: Record<string, string> = {
  'Stored':              'bg-blue-950/30 text-blue-400 border border-blue-900/40',
  'In Storage':          'bg-blue-950/30 text-blue-400 border border-blue-900/40',
  'Retrieval Pending':   'bg-orange-950/30 text-orange-400 border border-orange-900/40',
  'Retrieval Requested': 'bg-orange-950/30 text-orange-400 border border-orange-900/40',
  'Retrieved':           'bg-green-950/30 text-green-400 border border-green-900/40',
  'Damaged':             'bg-red-950/30 text-red-400 border border-red-900/40',
};

export default function InventoryManagement() {
  const { items, loading, error, updateStatus, add } = useStoredItems();
  const { customers } = useCustomers();
  const { configured } = useSheetsConfig();

  const handleSave = async (item: any) => {
    const storedItem: Omit<StoredItem, 'id' | 'addedAt'> = {
      customerId: item.customerId,
      storageId: '',
      name: item.itemName,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      condition: 'Good',
      notes: item.notes,
      isExtra: true,
      status: 'In Storage',
      isFragile: item.isFragile,
      requiresClimate: item.requiresClimate,
      customerName: item.customerName,
      zone: item.zone,
      rack: item.rack,
      dateAdded: item.dateAdded,
    };
    const res = await add(storedItem);
    return { success: res.success };
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const ok = await updateStatus(id, status as any);
    if (ok) showToast(`Status updated to "${status}"`, 'success');
    else showToast('Status update failed.', 'error');
  };

  const filtered = items.filter(item => {
    const matchSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 text-brand-text select-none">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold border flex items-center gap-2 animate-in slide-in-from-right duration-300',
          toast.type === 'success' 
            ? 'bg-green-950/80 border-green-800 text-green-400' 
            : 'bg-red-950/80 border-red-800 text-red-400'
        )}>
          {toast.message}
        </div>
      )}

      {/* Not Configured Banner */}
      {!configured && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">Google Sheets Not Connected</p>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Showing demo data. Configure your <code className="bg-brand-light/95 border border-brand-border px-1.5 py-0.5 rounded text-brand-gold font-mono text-[10px]">.env</code> to enable live sync.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-brand-text">INVENTORY MANAGEMENT</h1>
          <p className="text-brand-muted mt-1 text-sm font-medium">
            {loading ? 'Polling storage catalogs...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} currently logged`}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-brand-light hover:bg-brand-surface text-brand-text px-4 py-2.5 rounded-lg text-xs font-bold border border-brand-border transition-colors shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.98]">
            <Download className="w-4 h-4 text-brand-gold" /> Export Catalog
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="vault-btn-gold px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <Box className="w-4 h-4 text-black" /> Receive Items
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="vault-glass rounded-xl shadow-lg overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item name, ID, or customer..."
              className="w-full pl-10 pr-4 py-2.5 vault-input rounded-lg text-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="px-3 py-2 bg-brand-light border border-brand-border rounded-lg text-xs font-bold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
            >
              <option value="All" className="bg-brand-surface">All Zones</option>
              <option className="bg-brand-surface">Zone A</option>
              <option className="bg-brand-surface">Zone B</option>
              <option className="bg-brand-surface">Zone C</option>
              <option className="bg-brand-surface">Zone D</option>
            </select>
            <select
              className="px-3 py-2 bg-brand-light border border-brand-border rounded-lg text-xs font-bold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All" className="bg-brand-surface">All Statuses</option>
              <option className="bg-brand-surface">Stored</option>
              <option className="bg-brand-surface">Retrieval Pending</option>
              <option className="bg-brand-surface">Retrieved</option>
              <option className="bg-brand-surface">Damaged</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          )}
          {error && (
            <div className="p-8 text-center text-red-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="font-bold uppercase tracking-wider text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light text-brand-gold text-xs border-b border-brand-border uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-xs">
                {filtered.length > 0 ? filtered.map(item => (
                  <tr key={item.id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-brand-text flex items-center gap-2">
                        {item.name}
                        {item.isFragile && <span title="Fragile" className="text-orange-500 text-xs">⚠️</span>}
                        {item.requiresClimate && <span title="Climate Controlled" className="text-blue-500 text-xs">🌡️</span>}
                      </div>
                      <div className="text-[10px] text-brand-muted mt-0.5 font-mono">{item.id}</div>
                      {item.description && <div className="text-xs text-brand-muted mt-0.5 truncate max-w-[200px] font-semibold">{item.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-brand-text">{item.customerName}</div>
                      <div className="text-[10px] text-brand-muted mt-0.5 font-mono">{item.customerId}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brand-text">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-brand-text font-black font-sans">
                      {item.quantity} <span className="font-bold text-xs text-brand-muted">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs font-semibold text-brand-text">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold mr-1.5" />
                        {item.zone}, {item.rack}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brand-muted">{item.dateAdded}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={e => handleStatusChange(item.id!, e.target.value as ItemStatus)}
                        className={clsx(
                          'text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full outline-none border cursor-pointer bg-brand-dark focus:ring-1 focus:ring-brand-gold/30',
                          STATUS_COLORS[item.status || 'Stored']
                        )}
                      >
                        <option className="bg-brand-surface text-brand-text">Stored</option>
                        <option className="bg-brand-surface text-brand-text">Retrieval Pending</option>
                        <option className="bg-brand-surface text-brand-text">Retrieved</option>
                        <option className="bg-brand-surface text-brand-text">Damaged</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-muted">
                      <div className="flex flex-col items-center gap-3 py-8">
                        <Box className="w-8 h-8 text-brand-gold/30" />
                        <p className="font-bold text-sm uppercase tracking-wider">No items found</p>
                        <p className="text-xs">Try a different filter or register new incoming storage items.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-border flex items-center justify-between bg-brand-light/30">
          <span className="text-xs text-brand-muted font-bold">{filtered.length} item{filtered.length !== 1 ? 's' : ''} cataloged</span>
          <span className={clsx(
            'text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border',
            configured 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' 
              : 'bg-amber-950/30 text-amber-400 border-amber-900/40'
          )}>
            {configured ? 'Live – Google Sheets Active' : 'Offline Demo Mode'}
          </span>
        </div>
      </div>

      {/* Modal */}
      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        customers={customers}
      />
    </div>
  );
}
