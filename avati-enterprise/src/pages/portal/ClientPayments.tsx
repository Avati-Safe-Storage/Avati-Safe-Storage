import { useState, useEffect } from 'react';
import { getPayments } from '../../lib/googleSheets';
import type { Payment } from '../../lib/googleSheets';
import { CreditCard, Download, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const TYPE_COLORS: Record<string, string> = {
  'Advance': 'bg-purple-950/40 border border-purple-500/20 text-purple-400',
  'Transportation': 'bg-blue-950/40 border border-blue-500/20 text-blue-400',
  'Packing': 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-400',
  'Monthly Storage': 'bg-brand-gold/10 border border-brand-gold/20 text-brand-gold',
  'Insurance': 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400',
  'Miscellaneous': 'bg-white/5 border border-white/10 text-brand-muted',
};

const STATUS_ICON = {
  'Paid': <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  'Pending': <Clock className="w-4 h-4 text-amber-400" />,
  'Overdue': <AlertCircle className="w-4 h-4 text-red-400" />,
  'Waived': <CheckCircle2 className="w-4 h-4 text-brand-muted/40" />,
};

export default function ClientPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments(user?.id).then(d => { setPayments(d); setLoading(false); });
  }, [user]);

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.totalAmount, 0);
  const totalDue = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((s, p) => s + p.totalAmount, 0);
  const overdue = payments.filter(p => p.status === 'Overdue');

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-brand-text uppercase tracking-wider">Payment History</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, cls: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' },
          { label: 'Amount Due', value: `₹${totalDue.toLocaleString()}`, cls: 'text-amber-400 bg-amber-950/20 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' },
          { label: 'Overdue', value: overdue.length, cls: overdue.length > 0 ? 'text-red-400 bg-red-950/20 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'text-brand-muted bg-white/5 border-white/5' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-xl border p-4 text-center', s.cls)}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="bg-red-950/25 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" />
          <div>
            <p className="font-black text-red-400 text-sm uppercase tracking-wide">Overdue Payment Found</p>
            <p className="text-xs text-red-300/80 mt-0.5">You have {overdue.length} overdue payment(s). Please process payment to keep your storage vault active without disruption.</p>
          </div>
        </div>
      )}

      {/* Payment cards */}
      <div className="space-y-3.5">
        {payments.map(pay => (
          <div key={pay.id} className="vault-glass rounded-xl p-4 transition-all hover:border-[#D4AF37]/35 hover:bg-white/[0.01]">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-brand-muted/40">PAY-{pay.id}</span>
                  <span className={clsx('text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border', TYPE_COLORS[pay.type] || 'bg-white/5 border-white/10 text-brand-muted')}>
                    {pay.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold"
                    style={{ color: pay.status === 'Paid' ? '#34d399' : pay.status === 'Overdue' ? '#f87171' : '#fbbf24' }}>
                    {STATUS_ICON[pay.status as keyof typeof STATUS_ICON]}
                    <span className="uppercase tracking-wider text-[10px]">{pay.status}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-brand-text">{pay.description}</p>
                {pay.billingPeriod && <p className="text-xs text-brand-muted/65 flex items-center gap-1.5">📅 {pay.billingPeriod}</p>}
                <div className="flex items-center gap-4 text-[11px] text-brand-muted/50 font-medium">
                  {pay.paidOn && <span>Paid on: {pay.paidOn}</span>}
                  {pay.dueDate && !pay.paidOn && <span>Due by: {pay.dueDate}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-end gap-2 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                <div>
                  <p className="text-lg font-black text-brand-text">₹{pay.totalAmount.toLocaleString()}</p>
                  {pay.gstAmount && pay.gstAmount > 0 && (
                    <p className="text-[10px] text-brand-muted/40 font-bold">incl. GST ₹{pay.gstAmount.toLocaleString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {pay.invoiceUrl && (
                    <a href={pay.invoiceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-brand-gold font-bold hover:underline justify-end cursor-pointer bg-white/5 border border-white/5 px-2 py-1 rounded-lg">
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </a>
                  )}
                  {pay.status === 'Pending' && (
                    <button className="px-3.5 py-1.5 vault-btn-gold text-xs font-bold rounded-lg transition-all cursor-pointer">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="text-center py-16 text-brand-muted bg-white/5 rounded-xl border border-white/5">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30 text-brand-gold animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider">No payment records yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
