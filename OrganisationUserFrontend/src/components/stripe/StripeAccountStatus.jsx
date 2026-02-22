'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

const STATUS_VARIANT = {
  active: 'default',
  restricted: 'secondary',
  pending: 'outline',
};

const STATUS_LABEL = {
  active: 'Active',
  restricted: 'Restricted',
  pending: 'Pending',
};

export default function StripeAccountStatus({
  accountId,
  status,
  payoutsEnabled,
  chargesEnabled,
  detailsSubmitted,
  onRefresh,
  onOpenDashboard,
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [openingDashboard, setOpeningDashboard] = useState(false);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleOpenDashboard() {
    try {
      setOpeningDashboard(true);
      await onOpenDashboard();
    } finally {
      setOpeningDashboard(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stripe Account</h3>
          <Badge variant={STATUS_VARIANT[status] || 'outline'}>
            {STATUS_LABEL[status] || status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Account ID</span>
            <span className="font-mono text-xs">{accountId}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Details Submitted</span>
            <span>{detailsSubmitted ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Payouts Enabled</span>
            <span>{payoutsEnabled ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Charges Enabled</span>
            <span>{chargesEnabled ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Status
          </Button>
          <Button size="sm" onClick={handleOpenDashboard} disabled={openingDashboard}>
            {openingDashboard ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" />
            )}
            Open Stripe Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
