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
  'New':              { color: 'bg-blue-950/30 text-blue-400 border border-blue-900/40',   label: 'New' },
  'Contacted':        { color: 'bg-purple-950/30 text-purple-400 border border-purple-900/40', label: 'Contacted' },
  'Quotation Sent':   { color: 'bg-yellow-950/30 text-yellow-400 border border-yellow-900/40', label: 'Quotation Sent' },
  'Booking Confirmed':{ color: 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/40', label: 'Booking Confirmed' },
  'Converted':        { color: 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40',  label: 'Converted ✓' },
  'Lost':             { color: 'bg-rose-950/30 text-rose-400 border border-rose-900/40',     label: 'Lost' },
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
    <div className="space-y-6 text-brand-text select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-brand-text">LEAD MANAGEMENT</h1>
          <p className="text-brand-muted mt-1 text-sm font-medium">Website quote enquiries and conversion pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total, icon: TrendingUp, color: 'text-blue-400 bg-blue-950/20 border border-blue-900/30' },
          { label: 'New Enquiries', value: stats.new, icon: Plus, color: 'text-purple-400 bg-purple-950/20 border border-purple-900/30' },
          { label: 'Quotation Sent', value: stats.quotationSent, icon: Clock, color: 'text-yellow-400 bg-yellow-950/20 border border-yellow-900/30' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30' },
        ].map(s => (
          <div key={s.label} className="vault-card rounded-xl border border-brand-border p-4 flex items-center gap-4">
            <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-text">{s.value}</p>
              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="vault-glass rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              className="w-full pl-9 pr-4 py-2.5 vault-input rounded-lg text-xs"
              placeholder="Search leads..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['All', 'New', 'Contacted', 'Quotation Sent', 'Booking Confirmed', 'Converted', 'Lost'] as const).map(s => (
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

        <div className="overflow-x-auto min-h-[200px] relative">
          {loading && (
            <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light text-brand-gold text-xs border-b border-brand-border uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5">Lead</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Storage</th>
                <th className="px-5 py-3.5">Estimate</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-xs">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-brand-light/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-sm text-brand-text">{lead.name}</div>
                    <div className="text-[10px] text-brand-muted font-mono mt-0.5">{lead.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-brand-text"><Phone className="w-3.5 h-3.5 text-brand-gold" />{lead.phone}</div>
                    <div className="flex items-center gap-1.5 text-brand-muted mt-0.5 font-mono"><Mail className="w-3.5 h-3.5 text-brand-gold/70" />{lead.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-brand-text">{lead.storageType}</div>
                    <div className="text-[10px] text-brand-muted capitalize mt-0.5">{lead.plan} plan · {lead.area}</div>
                  </td>
                  <td className="px-5 py-4">
                    {lead.monthlyEstimate ? (
                      <>
                        <div className="text-sm font-bold text-brand-text">₹{lead.monthlyEstimate?.toLocaleString()}/mo</div>
                        <div className="text-[10px] text-brand-muted">₹{lead.totalEstimate?.toLocaleString()} est. total</div>
                      </>
                    ) : <span className="text-brand-muted">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      disabled={lead.status === 'Converted' || updatingId === lead.id}
                      onChange={e => handleStatusUpdate(lead.id, e.target.value as LeadStatus)}
                      className={clsx(
                        'text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full outline-none border cursor-pointer bg-brand-dark focus:ring-1 focus:ring-brand-gold/30',
                        STATUS_CONFIG[lead.status].color
                      )}
                    >
                      {Object.keys(STATUS_CONFIG).map(s => (
                        <option key={s} value={s} className="bg-brand-surface text-brand-text">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-brand-muted font-semibold">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-brand-muted hover:text-brand-gold bg-brand-light border border-brand-border rounded-lg transition-colors cursor-pointer" 
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                        <button 
                          onClick={() => handleConvert(lead)}
                          className="flex items-center gap-1 px-3 py-1.5 vault-btn-gold text-black rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-[0.97]"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-black" /> Convert
                        </button>
                      )}
                      {lead.status === 'Converted' && lead.convertedCustomerId && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded">
                          {lead.convertedCustomerId}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-brand-muted">
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Search className="w-8 h-8 text-brand-gold/30" />
                      <p className="font-semibold text-sm">No leads found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
          <div className="bg-brand-surface w-full max-w-md h-full overflow-y-auto shadow-2xl p-6 border-l border-brand-border space-y-6 animate-in slide-in-from-right duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-brand-border pb-4">
              <div>
                <h2 className="text-xl font-black text-brand-text">{selectedLead.name}</h2>
                <p className="text-xs font-mono text-brand-gold mt-1">{selectedLead.id}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)} 
                className="p-1.5 hover:bg-brand-light rounded-lg text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className={clsx('inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase border', STATUS_CONFIG[selectedLead.status].color)}>
              {selectedLead.status}
            </div>

            <div className="space-y-1 text-xs">
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
                <div key={label as string} className="flex justify-between py-3 border-b border-brand-border/40 last:border-0 items-center">
                  <span className="text-brand-muted font-semibold">{label}</span>
                  <span className="font-bold text-brand-text text-right font-sans">{value}</span>
                </div>
              ))}
            </div>

            {selectedLead.status !== 'Converted' && selectedLead.status !== 'Lost' && (
              <button 
                onClick={() => { setSelectedLead(null); handleConvert(selectedLead); }}
                className="w-full vault-btn-gold text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-black" /> Convert to Customer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
