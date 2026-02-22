'use client';

import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ConnectedAccount } from '@/lib/admin-api';

interface AccountStatusMonitorProps {
  accounts: ConnectedAccount[];
}

export function AccountStatusMonitor({ accounts }: AccountStatusMonitorProps) {
  const active = accounts.filter((a) => a.status === 'active');
  const pending = accounts.filter((a) => a.status === 'pending');
  const restricted = accounts.filter((a) => a.status === 'restricted');
  const disabled = accounts.filter((a) => a.status === 'disabled');
  const payoutsDisabled = accounts.filter((a) => !a.payoutsEnabled && a.status !== 'disabled');
  const onboardingIncomplete = accounts.filter((a) => !a.stripeOnboardingComplete && a.status !== 'disabled');

  const statusCards = [
    { label: 'Active', count: active.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending', count: pending.length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Restricted', count: restricted.length, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Disabled', count: disabled.length, icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Status Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{card.label}</CardDescription>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl">{card.count}</CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Issues */}
      {(onboardingIncomplete.length > 0 || payoutsDisabled.length > 0 || restricted.length > 0) && (
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              Accounts Needing Attention
            </CardTitle>
            <CardDescription>
              Organisations with onboarding or payout issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {onboardingIncomplete.map((account) => (
              <div
                key={`onboard-${account.orgId}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-sm">{account.orgName}</p>
                  <p className="text-xs text-muted-foreground">
                    Onboarding incomplete
                  </p>
                </div>
                <Badge variant="warning">Incomplete Onboarding</Badge>
              </div>
            ))}

            {payoutsDisabled.map((account) => (
              <div
                key={`payout-${account.orgId}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-sm">{account.orgName}</p>
                  <p className="text-xs text-muted-foreground">
                    Payouts are disabled — institute cannot receive funds
                  </p>
                </div>
                <Badge variant="destructive">Payouts Disabled</Badge>
              </div>
            ))}

            {restricted.map((account) => (
              <div
                key={`restricted-${account.orgId}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-sm">{account.orgName}</p>
                  <p className="text-xs text-muted-foreground">
                    Account is restricted — may need additional verification
                  </p>
                </div>
                <Badge variant="destructive">Restricted</Badge>
              </div>
            ))}

            {onboardingIncomplete.length === 0 && payoutsDisabled.length === 0 && restricted.length === 0 && (
              <p className="text-sm text-muted-foreground">All accounts are healthy.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
