import { useState } from 'react';
import { Search, Box, MapPin, Download, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useStoredItems, useCustomers, useSheetsConfig } from '../../hooks/useGoogleSheets';
import InventoryModal from '../../components/admin/InventoryModal';
import type { ItemStatus, StoredItem } from '../../lib/googleSheets';

const STATUS_COLORS: Record<string, string> = {
  'In Storage':          'bg-blue-100 text-blue-800',
  'Retrieval Requested': 'bg-orange-100 text-orange-800',
  'Retrieved':           'bg-green-100 text-green-800',
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
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-right',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.message}
        </div>
      )}

      {/* Not Configured Banner */}
      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Google Sheets Not Connected</p>
            <p className="text-xs text-amber-700 mt-1">
              Showing demo data. Configure your <code className="bg-amber-100 px-1 rounded">.env</code> to enable live sync.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} tracked`}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Box className="w-5 h-5" /> Receive Items
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item name, ID, or customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold text-gray-700"
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
            >
              <option value="All">All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
              <option>Zone D</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold text-gray-700"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option>Stored</option>
              <option>Retrieval Pending</option>
              <option>Retrieved</option>
              <option>Damaged</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          )}
          {error && (
            <div className="p-8 text-center text-red-600 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">Item Details</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Qty</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Date Added</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length > 0 ? filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {item.name}
                        {item.isFragile && <span title="Fragile" className="text-orange-500 text-xs">⚠️</span>}
                        {item.requiresClimate && <span title="Climate Controlled" className="text-blue-500 text-xs">🌡️</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">{item.id}</div>
                      {item.description && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{item.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.customerName}</div>
                      <div className="text-xs text-gray-500">{item.customerId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                      {item.quantity} <span className="font-normal text-gray-500">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                        {item.zone}, {item.rack}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.dateAdded}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={e => handleStatusChange(item.id!, e.target.value as ItemStatus)}
                        className={clsx(
                          'text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer',
                          STATUS_COLORS[item.status || 'Stored']
                        )}
                      >
                        <option>Stored</option>
                        <option>Retrieval Pending</option>
                        <option>Retrieved</option>
                        <option>Damaged</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Box className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="font-medium">No items found</p>
                        <p className="text-sm">Try a different filter or receive new items.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
          <span className={clsx('text-xs px-2 py-1 rounded-full font-medium',
            configured ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
            {configured ? '🟢 Live – Google Sheets' : '🟡 Demo Mode'}
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
