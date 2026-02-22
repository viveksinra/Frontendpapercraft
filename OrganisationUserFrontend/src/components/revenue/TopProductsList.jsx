'use client';

import { Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function TopProductsList({ products = [], currency = 'GBP' }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Top Products</h3>
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No sales data yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-medium">Top Products</h3>
      </div>
      <div className="flex flex-col gap-2">
        {products.map((product, i) => (
          <div
            key={product.productId || i}
            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </span>
              <span className="font-medium">{product.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {product.purchaseCount || 0} sale{(product.purchaseCount || 0) !== 1 ? 's' : ''}
              </Badge>
              <span className="font-medium">{formatPrice(product.revenue, currency)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
