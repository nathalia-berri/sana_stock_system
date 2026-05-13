import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-[#2563EB]',
}: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 hover:shadow-lg transition-shadow border border-[#E2E8F0]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#64748B] mb-1">{title}</p>
          <p className="text-2xl font-semibold text-[#0F172A] mb-2">{value}</p>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </p>
          )}
        </div>

        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
