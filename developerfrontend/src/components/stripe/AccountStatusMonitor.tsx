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

  return (
    <div className="space-y-4">
      {/* Status Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{active.length}</CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Pending</CardDescription>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{pending.length}</CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Restricted</CardDescription>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{restricted.length}</CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Disabled</CardDescription>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{disabled.length}</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Issues */}
      {(onboardingIncomplete.length > 0 || payoutsDisabled.length > 0 || restricted.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
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
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium text-sm">{account.orgName}</p>
                  <p className="text-xs text-muted-foreground">
                    Onboarding incomplete
                  </p>
                </div>
                <Badge variant="secondary">Incomplete Onboarding</Badge>
              </div>
            ))}

            {payoutsDisabled.map((account) => (
              <div
                key={`payout-${account.orgId}`}
                className="flex items-center justify-between rounded-md border p-3"
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
                className="flex items-center justify-between rounded-md border p-3"
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
