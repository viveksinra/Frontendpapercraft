'use client';

import { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function RevenueTimeSeriesChart({ data = [], currency = 'GBP' }) {
  const maxRevenue = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.revenue || 0));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Revenue Over Time</h3>
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No revenue data for this period.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">Revenue Over Time</h3>
      <div className="flex items-end gap-1 h-48">
        {data.map((point, i) => {
          const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
              title={`${point.label || point.date}: ${formatPrice(point.revenue, currency)}`}
            >
              <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className="w-full max-w-8 rounded-t bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {point.label || point.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
