import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
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

  const handleSave = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
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
  const openEdit = (c: Customer) => { setEditingCustomer(c); setModalOpen(true); };

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
              Showing demo data. Add <code className="bg-brand-light/95 border border-brand-border px-1.5 py-0.5 rounded text-brand-gold font-mono text-[10px]">VITE_APPS_SCRIPT_URL</code> and{' '}
              <code className="bg-brand-light/95 border border-brand-border px-1.5 py-0.5 rounded text-brand-gold font-mono text-[10px]">VITE_SHEET_ID</code> to your <code className="bg-brand-light/95 border border-brand-border px-1.5 py-0.5 rounded text-brand-gold font-mono text-[10px]">.env</code> file to enable live sync.{' '}
              See the setup guide for instructions.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-brand-text">CUSTOMER MANAGEMENT</h1>
          <p className="text-brand-muted mt-1 text-sm font-medium">
            {loading ? 'Querying records...' : `${filtered.length} active customer${filtered.length !== 1 ? 's' : ''} index entries`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="vault-btn-gold px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" /> Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="vault-glass rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 vault-input rounded-lg text-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'Active', 'Pending', 'Inactive'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer',
                  statusFilter === s
                    ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'bg-brand-light text-brand-muted border-brand-border hover:text-brand-text hover:bg-brand-surface'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">KYC</th>
                  <th className="px-6 py-4">Storage</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-xs">
                {filtered.length > 0 ? filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-gold font-black text-sm flex-shrink-0">
                          {(customer.name || customer.company || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-brand-text">{customer.name}</div>
                          {customer.company && <div className="text-xs text-brand-gold mt-0.5">{customer.company}</div>}
                          <div className="text-[10px] text-brand-muted font-mono mt-0.5">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-brand-text">{customer.email}</div>
                      <div className="text-xs text-brand-muted mt-0.5 font-mono">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-brand-text uppercase">{customer.kycType}</div>
                      <div className="text-xs text-brand-muted font-mono mt-0.5">{customer.kycId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-brand-text">{customer.storageUnit || '—'}</div>
                      {customer.monthlyRate && <div className="text-xs text-brand-gold mt-0.5">₹{customer.monthlyRate}/mo</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text font-black font-sans">
                      {customer.items ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                        customer.status === 'Active'   ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' :
                        customer.status === 'Inactive' ? 'bg-brand-light text-brand-muted border-brand-border' :
                                                          'bg-yellow-950/30 text-yellow-400 border-yellow-900/40'
                      )}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {customer.driveFolder && (
                          <a 
                            href={customer.driveFolder} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-brand-muted hover:text-brand-gold bg-brand-light border border-brand-border rounded-lg transition-colors cursor-pointer" 
                            title="Open Drive Folder"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button 
                          onClick={() => openEdit(customer)}
                          className="p-2 text-brand-muted hover:text-brand-gold bg-brand-light border border-brand-border rounded-lg transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id!)}
                          disabled={deletingId === customer.id}
                          className="p-2 text-red-400 hover:text-white hover:bg-red-600 bg-red-950/20 border border-red-900/30 hover:border-red-600 rounded-lg transition-colors disabled:opacity-40 cursor-pointer" 
                          title="Delete"
                        >
                          {deletingId === customer.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-muted">
                      <div className="flex flex-col items-center gap-3 py-8">
                        <Search className="w-8 h-8 text-brand-gold/30" />
                        <p className="font-bold text-sm uppercase tracking-wider">No customers found</p>
                        <p className="text-xs">Try a different search term or register a new client record above.</p>
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
          <span className="text-xs text-brand-muted font-bold">{filtered.length} active customer{filtered.length !== 1 ? 's' : ''} cataloged</span>
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
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingCustomer}
      />
    </div>
  );
}
