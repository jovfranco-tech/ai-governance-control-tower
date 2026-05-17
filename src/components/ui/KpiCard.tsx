import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  intent?: 'neutral' | 'danger' | 'warning' | 'success';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon: Icon, trend, intent = 'neutral', onClick }) => {
  
  const iconColors = {
    neutral: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    danger: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    warning: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  };

  return (
    <div 
      onClick={onClick}
      className={`card p-6 flex items-start group ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/50 dark:hover:ring-indigo-500/50' : ''}`}
    >
      <div className={`p-3 rounded-xl ${iconColors[intent]} mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {trend && (
            <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
