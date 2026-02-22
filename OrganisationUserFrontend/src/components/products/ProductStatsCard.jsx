'use client';

import { ShoppingCart, TrendingUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function ProductStatsCard({ purchaseCount = 0, revenue = 0, currency = 'GBP' }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <ShoppingCart className="h-3.5 w-3.5" />
        {purchaseCount} {purchaseCount === 1 ? 'sale' : 'sales'}
      </span>
      <span className="flex items-center gap-1">
        <TrendingUp className="h-3.5 w-3.5" />
        {formatPrice(revenue, currency)}
      </span>
    </div>
  );
}
