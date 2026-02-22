'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

function KPICard({ title, value, subtitle, trend, icon: Icon }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-2xl font-bold">{value}</span>
      {subtitle && (
        <div className="flex items-center gap-1 text-xs">
          {trend != null && trend !== 0 && (
            <>
              {trend > 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              )}
              <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </>
          )}
          <span className="text-muted-foreground">{subtitle}</span>
        </div>
      )}
    </div>
  );
}

export default function RevenueOverviewCards({ data, currency = 'GBP' }) {
  if (!data) return null;

  const avgOrderValue =
    data.totalTransactions > 0
      ? data.totalRevenue / data.totalTransactions
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Revenue"
        value={formatPrice(data.totalRevenue, currency)}
        icon={DollarSign}
      />
      <KPICard
        title="This Month"
        value={formatPrice(data.currentMonthRevenue, currency)}
        subtitle="vs last month"
        trend={data.monthOverMonthGrowth}
        icon={TrendingUp}
      />
      <KPICard
        title="Total Transactions"
        value={data.totalTransactions || 0}
        icon={ShoppingCart}
      />
      <KPICard
        title="Avg Order Value"
        value={formatPrice(avgOrderValue, currency)}
        icon={BarChart3}
      />
    </div>
  );
}
