'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ConnectedAccount } from '@/lib/admin-api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function statusVariant(status: string): 'success' | 'secondary' | 'destructive' | 'outline' | 'warning' {
  switch (status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'restricted': return 'destructive';
    case 'disabled': return 'destructive';
    default: return 'outline';
  }
}

interface ConnectedAccountsListProps {
  accounts: ConnectedAccount[];
  total: number;
}

export function ConnectedAccountsList({ accounts, total }: ConnectedAccountsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Stripe Accounts</CardTitle>
        <CardDescription>
          {total} organisation{total !== 1 ? 's' : ''} with Stripe Connect accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No connected Stripe accounts found.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Payouts</TableHead>
                  <TableHead>Charges</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Connected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.orgId}>
                    <TableCell className="font-medium">{account.orgName}</TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground">
                        {account.stripeAccountId.slice(0, 16)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(account.status)}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.stripeOnboardingComplete ? 'success' : 'warning'}>
                        {account.stripeOnboardingComplete ? 'Complete' : 'Incomplete'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.payoutsEnabled ? 'success' : 'destructive'}>
                        {account.payoutsEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.chargesEnabled ? 'success' : 'destructive'}>
                        {account.chargesEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(account.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(account.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
