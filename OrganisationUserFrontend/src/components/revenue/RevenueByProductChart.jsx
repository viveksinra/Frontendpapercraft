'use client';

import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

const TYPE_COLORS = {
  paper: 'bg-blue-500',
  paper_set: 'bg-indigo-500',
  test: 'bg-purple-500',
  bundle: 'bg-amber-500',
};

export default function RevenueByProductChart({ data = [], currency = 'GBP' }) {
  const maxRevenue = data.length > 0 ? Math.max(...data.map((d) => d.revenue || 0)) : 0;

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Revenue by Product Type</h3>
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">Revenue by Product Type</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, i) => {
          const width = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.type || item.category || 'Other'}</Badge>
                  <span className="text-muted-foreground">
                    {item.count || 0} sale{(item.count || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="font-medium">{formatPrice(item.revenue, currency)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${TYPE_COLORS[item.type] || 'bg-primary'}`}
                  style={{ width: `${Math.max(width, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
