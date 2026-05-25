import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export default function StatCard({ title, value, icon, trend, trendLabel, className }: StatCardProps) {
  return (
    <div className={clsx("vault-card p-6 rounded-2xl shadow-lg border border-brand-border", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-brand-text">{value}</h3>
        </div>
        <div className="p-3 bg-brand-light border border-brand-border rounded-xl text-brand-gold shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center text-xs">
          <span 
            className={clsx(
              "flex items-center font-bold px-2 py-0.5 rounded-full border",
              trend >= 0 
                ? "text-emerald-400 bg-emerald-950/30 border-emerald-800/40" 
                : "text-rose-400 bg-rose-950/30 border-rose-800/40"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-brand-muted ml-2 font-semibold">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
