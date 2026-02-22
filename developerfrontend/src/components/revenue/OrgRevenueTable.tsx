'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlatformRevenueOverview } from '@/lib/admin-api';

function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

interface OrgRevenueTableProps {
  data: PlatformRevenueOverview['revenueByOrg'];
  currency?: string;
}

export function OrgRevenueTable({ data, currency = 'GBP' }: OrgRevenueTableProps) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Organisation</CardTitle>
        <CardDescription>
          Per-institute revenue breakdown sorted by total revenue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No revenue data available.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Stripe Account</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Platform Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((org) => (
                  <TableRow key={org.orgId}>
                    <TableCell className="font-medium">{org.orgName}</TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground">
                        {org.stripeAccountId ? org.stripeAccountId.slice(0, 16) + '...' : '—'}
                      </code>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {org.transactions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(org.revenue, currency)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(org.platformFee, currency)}
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
