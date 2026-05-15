import { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash2, Loader2, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useCustomers, useSheetsConfig } from '../../hooks/useGoogleSheets';
import CustomerModal from '../../components/admin/CustomerModal';
import type { Customer } from '../../lib/googleSheets';

export default function CustomerManagement() {
  const { customers, loading, error, add, update, remove } = useCustomers();
  const { configured } = useSheetsConfig();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (customer: CustomerData) => {
    const result = editingCustomer
      ? { success: await update({ ...customer, id: editingCustomer.id }) }
      : await add(customer);
    if (result.success) showToast(editingCustomer ? 'Customer updated!' : 'Customer added to Google Sheets!', 'success');
    else showToast('Save failed. Check Sheets configuration.', 'error');
    return result;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    setDeletingId(id);
    const ok = await remove(id);
    setDeletingId(null);
    if (ok) showToast('Customer deleted.', 'success');
    else showToast('Delete failed.', 'error');
  };

  const openAdd = () => { setEditingCustomer(null); setModalOpen(true); };
  const openEdit = (c: CustomerData) => { setEditingCustomer(c); setModalOpen(true); };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-right',
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
              Showing demo data. Add <code className="bg-amber-100 px-1 rounded">VITE_APPS_SCRIPT_URL</code> and{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_SHEET_ID</code> to your <code className="bg-amber-100 px-1 rounded">.env</code> file to enable live sync.{' '}
              See the setup guide for instructions.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${filtered.length} customer${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'Active', 'Pending', 'Inactive'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                  statusFilter === s
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">KYC</th>
                  <th className="px-6 py-4 font-semibold">Storage</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length > 0 ? filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold font-bold text-sm flex-shrink-0">
                          {(customer.name || customer.company || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                          {customer.company && <div className="text-xs text-gray-500">{customer.company}</div>}
                          <div className="text-xs text-gray-400">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-gray-700">{customer.kycType}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{customer.kycId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.storageUnit || '—'}</div>
                      {customer.monthlyRate && <div className="text-xs text-gray-500">₹{customer.monthlyRate}/mo</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                      {customer.items ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                        customer.status === 'Active'   ? 'bg-green-100 text-green-800' :
                        customer.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                                                          'bg-yellow-100 text-yellow-800'
                      )}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {customer.driveFolder && (
                          <a href={customer.driveFolder} target="_blank" rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors" title="Open Drive Folder">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openEdit(customer)}
                          className="text-gray-400 hover:text-brand-dark transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(customer.id!)}
                          disabled={deletingId === customer.id}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40" title="Delete">
                          {deletingId === customer.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="font-medium">No customers found</p>
                        <p className="text-sm">Try a different search term or add a new customer.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
          <span className={clsx('text-xs px-2 py-1 rounded-full font-medium',
            configured ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
            {configured ? '🟢 Live – Google Sheets' : '🟡 Demo Mode'}
          </span>
        </div>
      </div>

      {/* Modal */}
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingCustomer}
      />
    </div>
  );
}
