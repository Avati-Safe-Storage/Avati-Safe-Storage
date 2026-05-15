import { ReactNode } from 'react';
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
    <div className={clsx("bg-white p-6 rounded-2xl shadow-sm border border-gray-100", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-brand-light rounded-xl text-brand-dark">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center text-sm">
          <span 
            className={clsx(
              "flex items-center font-medium",
              trend >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-gray-400 ml-2">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
