'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getBalance, getDashboardLink } from 'src/lib/stripe-connect-api';
import {
  getOverview,
  getByProduct,
  getTimeSeries,
  getTopProducts,
  getTransactions,
} from 'src/lib/revenue-api';

import TopProductsList from 'src/components/revenue/TopProductsList';
import PayoutStatusCard from 'src/components/revenue/PayoutStatusCard';
import TransactionsTable from 'src/components/revenue/TransactionsTable';
import RevenueOverviewCards from 'src/components/revenue/RevenueOverviewCards';
import RevenueByProductChart from 'src/components/revenue/RevenueByProductChart';
import RevenueTimeSeriesChart from 'src/components/revenue/RevenueTimeSeriesChart';

// ─────────────────────────────────────────────────────────────────

function getDateRange(preset) {
  const now = new Date();
  const start = new Date();

  switch (preset) {
    case 'this_month':
      start.setDate(1);
      break;
    case 'last_month': {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    case 'last_3_months':
      start.setMonth(start.getMonth() - 3);
      break;
    default:
      start.setMonth(start.getMonth() - 1);
  }

  return { startDate: start.toISOString(), endDate: now.toISOString() };
}

export default function RevenueDashboardPage() {
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('this_month');

  const [overview, setOverview] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [byProduct, setByProduct] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [balance, setBalance] = useState(null);

  const loadData = useCallback(async () => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return undefined;
    }

    try {
      setLoading(true);
      setError(null);
      const range = getDateRange(dateRange);

      const [overviewData, tsData, prodData, topData, txData] = await Promise.allSettled([
        getOverview(activeCompanyId, range),
        getTimeSeries(activeCompanyId, { ...range, granularity: 'day' }),
        getByProduct(activeCompanyId, range),
        getTopProducts(activeCompanyId, 5),
        getTransactions(activeCompanyId, { ...range, page: txPage, limit: 10 }),
      ]);

      if (overviewData.status === 'fulfilled') setOverview(overviewData.value);
      if (tsData.status === 'fulfilled') setTimeSeries(tsData.value?.data || tsData.value || []);
      if (prodData.status === 'fulfilled') setByProduct(prodData.value?.data || prodData.value || []);
      if (topData.status === 'fulfilled') setTopProducts(topData.value?.products || topData.value || []);
      if (txData.status === 'fulfilled') {
        setTransactions(txData.value?.transactions || txData.value || []);
        setTxTotalPages(txData.value?.totalPages || 1);
      }

      // Balance fetch (non-critical)
      try {
        const bal = await getBalance(activeCompanyId);
        setBalance(bal);
      } catch (_) { /* ignore */ }
    } catch (err) {
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, dateRange, txPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleOpenDashboard() {
    try {
      const result = await getDashboardLink(activeCompanyId);
      if (result?.url) window.open(result.url, '_blank');
    } catch (_) { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Revenue Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track your sales performance and earnings.
            </p>
          </div>

          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setTxPage(1);
            }}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
          </select>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <RevenueOverviewCards data={overview} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueTimeSeriesChart data={timeSeries} />
          <RevenueByProductChart data={byProduct} />
        </div>

        {/* Top products + Payout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopProductsList products={topProducts} />
          <PayoutStatusCard balance={balance} onOpenDashboard={handleOpenDashboard} />
        </div>

        {/* Transactions */}
        <TransactionsTable
          transactions={transactions}
          page={txPage}
          totalPages={txTotalPages}
          onPageChange={setTxPage}
        />
      </div>
    </div>
  );
}
