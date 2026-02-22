'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

function formatAmount(amount, currency = 'gbp') {
  const symbol = currency === 'inr' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

export default function PayoutStatusCard({ balance, onOpenDashboard }) {
  const [opening, setOpening] = useState(false);

  async function handleOpen() {
    try {
      setOpening(true);
      await onOpenDashboard?.();
    } finally {
      setOpening(false);
    }
  }

  const available = balance?.available || [];
  const pending = balance?.pending || [];

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Payout Status</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Available</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {available.length > 0
              ? available.map((b) => formatAmount(b.amount, b.currency)).join(', ')
              : '\u00A30.00'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Pending</span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {pending.length > 0
              ? pending.map((b) => formatAmount(b.amount, b.currency)).join(', ')
              : '\u00A30.00'}
          </span>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={handleOpen} disabled={opening}>
        {opening ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <ExternalLink className="mr-2 h-3.5 w-3.5" />
        )}
        Open Stripe Dashboard
      </Button>
    </div>
  );
}
