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

const cards = [
  { key: 'totalRevenue', label: 'Total Platform Revenue', desc: 'Across all institutes', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  { key: 'totalTransactions', label: 'Total Transactions', desc: 'Completed payments', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'platformFeeRevenue', label: 'Platform Fee Revenue', desc: 'Platform earnings from fees', icon: Percent, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'avgTransaction', label: 'Avg Transaction', desc: 'Average order value', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export function PlatformRevenueOverview({ data }: PlatformRevenueOverviewProps) {
  const avgTransaction = data.totalTransactions > 0
    ? data.totalRevenue / data.totalTransactions
    : 0;

  const values: Record<string, string> = {
    totalRevenue: formatCurrency(data.totalRevenue, data.currency),
    totalTransactions: data.totalTransactions.toLocaleString(),
    platformFeeRevenue: formatCurrency(data.platformFeeRevenue, data.currency),
    avgTransaction: formatCurrency(avgTransaction, data.currency),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl">
                {values[card.key]}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {card.desc}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
