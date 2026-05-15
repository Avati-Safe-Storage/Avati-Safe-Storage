import { useState, useEffect } from 'react';
import { getPayments } from '../../lib/googleSheets';
import type { Payment } from '../../lib/googleSheets';
import { CreditCard, Download, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const TYPE_COLORS: Record<string, string> = {
  'Advance': 'bg-purple-100 text-purple-800',
  'Transportation': 'bg-blue-100 text-blue-800',
  'Packing': 'bg-indigo-100 text-indigo-800',
  'Monthly Storage': 'bg-brand-gold/20 text-amber-800',
  'Insurance': 'bg-green-100 text-green-800',
  'Miscellaneous': 'bg-gray-100 text-gray-700',
};

const STATUS_ICON = {
  'Paid': <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'Pending': <Clock className="w-4 h-4 text-amber-500" />,
  'Overdue': <AlertCircle className="w-4 h-4 text-red-500" />,
  'Waived': <CheckCircle2 className="w-4 h-4 text-gray-400" />,
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
      <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, cls: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Amount Due', value: `₹${totalDue.toLocaleString()}`, cls: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Overdue', value: overdue.length, cls: overdue.length > 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-gray-700 bg-gray-50 border-gray-200' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-xl border p-4 text-center', s.cls)}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Overdue Payment</p>
            <p className="text-xs text-red-700 mt-0.5">You have {overdue.length} overdue payment(s). Please contact us to avoid service disruption.</p>
          </div>
        </div>
      )}

      {/* Payment cards */}
      <div className="space-y-3">
        {payments.map(pay => (
          <div key={pay.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-400">{pay.id}</span>
                  <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', TYPE_COLORS[pay.type] || 'bg-gray-100 text-gray-700')}>
                    {pay.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: pay.status === 'Paid' ? '#16a34a' : pay.status === 'Overdue' ? '#dc2626' : '#d97706' }}>
                    {STATUS_ICON[pay.status as keyof typeof STATUS_ICON]}
                    {pay.status}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{pay.description}</p>
                {pay.billingPeriod && <p className="text-xs text-gray-400">📅 {pay.billingPeriod}</p>}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {pay.paidOn && <span>Paid: {pay.paidOn}</span>}
                  {pay.dueDate && !pay.paidOn && <span>Due: {pay.dueDate}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-gray-900">₹{pay.totalAmount.toLocaleString()}</p>
                {pay.gstAmount && pay.gstAmount > 0 && (
                  <p className="text-xs text-gray-400">incl. GST ₹{pay.gstAmount.toLocaleString()}</p>
                )}
                {pay.invoiceUrl && (
                  <a href={pay.invoiceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 justify-end">
                    <Download className="w-3 h-3" /> Invoice
                  </a>
                )}
                {pay.status === 'Pending' && (
                  <button className="mt-2 px-3 py-1.5 bg-brand-gold text-brand-dark text-xs font-bold rounded-lg hover:bg-brand-gold/90 transition-all">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No payment records yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
