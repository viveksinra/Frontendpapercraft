'use client';

import { DollarSign, TrendingUp, CreditCard, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlatformRevenueOverview as PlatformRevenueData } from '@/lib/admin-api';

function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

interface PlatformRevenueOverviewProps {
  data: PlatformRevenueData;
}

export function PlatformRevenueOverview({ data }: PlatformRevenueOverviewProps) {
  const avgTransaction = data.totalTransactions > 0
    ? data.totalRevenue / data.totalTransactions
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Total Platform Revenue</CardDescription>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl">
            {formatCurrency(data.totalRevenue, data.currency)}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Across all institutes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Total Transactions</CardDescription>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl">
            {data.totalTransactions.toLocaleString()}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Completed payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Platform Fee Revenue</CardDescription>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl">
            {formatCurrency(data.platformFeeRevenue, data.currency)}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Platform earnings from fees
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Avg Transaction</CardDescription>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl">
            {formatCurrency(avgTransaction, data.currency)}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Average order value
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
