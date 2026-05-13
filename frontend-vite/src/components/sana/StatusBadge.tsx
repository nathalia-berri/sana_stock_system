type StockStatus = 'critical' | 'warning' | 'ok';

interface StatusBadgeProps {
  status: StockStatus;
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    critical: 'bg-red-100 text-red-700 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    ok: 'bg-green-100 text-green-700 border border-green-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {children}
    </span>
  );
}
