import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, UserPlus, Loader2,
  TrendingUp, Clock, CheckCircle2, Phone, Mail,
} from 'lucide-react';
import clsx from 'clsx';
import { useZohoAuth } from '../../hooks/useZohoAuth';
import { ZohoApi } from '../../lib/zoho/zohoApi';
import type { Lead } from '../../lib/zoho/zohoTypes';

type LeadStatus = Lead['status'];

const STATUS_CONFIG: Record<LeadStatus, { color: string; label: string }> = {
  'New':              { color: 'bg-blue-100 text-blue-800',   label: 'New' },
  'Contacted':        { color: 'bg-purple-100 text-purple-800', label: 'Contacted' },
  'Quotation Sent':   { color: 'bg-yellow-100 text-yellow-800', label: 'Quotation Sent' },
  'Booking Confirmed':{ color: 'bg-indigo-100 text-indigo-800', label: 'Booking Confirmed' },
  'Converted':        { color: 'bg-green-100 text-green-800',  label: 'Converted ✓' },
  'Lost':             { color: 'bg-red-100 text-red-800',     label: 'Lost' },
};

export default function LeadManagement() {
  const navigate = useNavigate();
  const { getValidToken } = useZohoAuth();
  const zohoApi = useMemo(() => new ZohoApi(getValidToken), [getValidToken]);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    zohoApi.getLeads().then(data => { setLeads(data); setLoading(false); });
  }, [zohoApi]);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    quotationSent: leads.filter(l => l.status === 'Quotation Sent').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  const handleStatusUpdate = async (id: string, status: LeadStatus) => {
    setUpdatingId(id);
    const leadToUpdate = leads.find(l => l.id === id);
    if (leadToUpdate?.zohoId) {
      await zohoApi.updateLeadStatus(leadToUpdate.zohoId, status);
    }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setUpdatingId(null);
  };

  const handleConvert = (lead: Lead) => {
    navigate('/admin/onboarding', { state: { lead } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 mt-1">Website quote enquiries and conversion pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
          { label: 'New Enquiries', value: stats.new, icon: Plus, color: 'text-purple-600 bg-purple-50' },
          { label: 'Quotation Sent', value: stats.quotationSent, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['All', 'New', 'Contacted', 'Quotation Sent', 'Booking Confirmed', 'Converted', 'Lost'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  statusFilter === s ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[200px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Lead</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Storage</th>
                <th className="px-5 py-3 font-semibold">Estimate</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{lead.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600"><Phone className="w-3.5 h-3.5" />{lead.phone}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5"><Mail className="w-3 h-3" />{lead.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-900">{lead.storageType}</div>
                    <div className="text-xs text-gray-500 capitalize">{lead.plan} plan · {lead.area}</div>
                  </td>
                  <td className="px-5 py-4">
                    {lead.monthlyEstimate ? (
                      <>
                        <div className="text-sm font-bold text-gray-900">₹{lead.monthlyEstimate?.toLocaleString()}/mo</div>
                        <div className="text-xs text-gray-500">₹{lead.totalEstimate?.toLocaleString()} est. total</div>
                      </>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      disabled={lead.status === 'Converted' || updatingId === lead.id}
                      onChange={e => handleStatusUpdate(lead.id, e.target.value as LeadStatus)}
                      className={clsx(
                        'text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer disabled:cursor-default',
                        STATUS_CONFIG[lead.status].color
                      )}
                    >
                      {Object.keys(STATUS_CONFIG).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedLead(lead)}
                        className="p-1.5 text-gray-400 hover:text-brand-dark rounded-lg hover:bg-gray-100 transition-colors" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                        <button onClick={() => handleConvert(lead)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-brand-gold text-brand-dark rounded-lg text-xs font-bold hover:bg-brand-gold/90 transition-all">
                          <UserPlus className="w-3.5 h-3.5" /> Convert
                        </button>
                      )}
                      {lead.status === 'Converted' && lead.convertedCustomerId && (
                        <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-1 rounded">
                          {lead.convertedCustomerId}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8" />
                    <p>No leads found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelectedLead(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <p className="text-sm font-mono text-brand-gold">{selectedLead.id}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-gray-100">✕</button>
            </div>

            <div className={clsx('inline-flex px-3 py-1 rounded-full text-xs font-bold', STATUS_CONFIG[selectedLead.status].color)}>
              {selectedLead.status}
            </div>

            <div className="space-y-3 text-sm">
              {[
                ['Phone', selectedLead.phone],
                ['Email', selectedLead.email],
                ['Storage Type', selectedLead.storageType],
                ['Plan', selectedLead.plan],
                ['Area', selectedLead.area],
                ['Pickup Date', selectedLead.pickupDate],
                ['Duration', selectedLead.duration ? `${selectedLead.duration} months` : undefined],
                ['Packing', selectedLead.packingRequired ? 'Yes' : 'No'],
                ['Transport', selectedLead.transportRequired ? `Yes (${selectedLead.distance}km)` : 'No'],
                ['Lift Available', selectedLead.liftAvailable],
                ['Monthly Estimate', selectedLead.monthlyEstimate ? `₹${selectedLead.monthlyEstimate.toLocaleString()}` : undefined],
                ['Total Estimate', selectedLead.totalEstimate ? `₹${selectedLead.totalEstimate.toLocaleString()}` : undefined],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            {selectedLead.status !== 'Converted' && selectedLead.status !== 'Lost' && (
              <button onClick={() => { setSelectedLead(null); handleConvert(selectedLead); }}
                className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark/90 transition-all">
                <UserPlus className="w-4 h-4" /> Convert to Customer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
