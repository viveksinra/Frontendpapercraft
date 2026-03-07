'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getBalance,
  connectAccount,
  getAccountStatus,
  getDashboardLink,
} from 'src/lib/stripe-connect-api';

import StripeBalanceCard from 'src/components/stripe/StripeBalanceCard';
import StripeConnectSetup from 'src/components/stripe/StripeConnectSetup';
import StripeAccountStatus from 'src/components/stripe/StripeAccountStatus';

// ─────────────────────────────────────────────────────────────────

export default function StripeSettingsPage() {
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const loadStatus = useCallback(async () => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return undefined;
    }

    try {
      setLoading(true);
      setError(null);
      const statusData = await getAccountStatus(activeCompanyId);
      setAccount(statusData);

      // If account is active, also fetch balance
      if (statusData?.status === 'active') {
        try {
          const balanceData = await getBalance(activeCompanyId);
          setBalance(balanceData);
        } catch (_) {
          // Balance fetch failure is non-critical
        }
      }
    } catch (err) {
      // 404 or similar means no Stripe account connected yet
      if (err.response?.status === 404 || err.response?.status === 400) {
        setAccount(null);
      } else {
        setError(err.message || 'Failed to load Stripe status');
      }
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleConnect() {
    const result = await connectAccount(activeCompanyId);
    return result;
  }

  async function handleRefresh() {
    await loadStatus();
  }

  async function handleOpenDashboard() {
    const result = await getDashboardLink(activeCompanyId);
    if (result?.url) {
      window.open(result.url, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isConnected = account?.accountId;

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Stripe Connect</h1>
          <p className="text-sm text-muted-foreground">
            Connect your Stripe account to accept payments for your products.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {isConnected ? (
          <div className="flex flex-col gap-4">
            <StripeAccountStatus
              accountId={account.accountId}
              status={account.status}
              payoutsEnabled={account.payoutsEnabled}
              chargesEnabled={account.chargesEnabled}
              detailsSubmitted={account.detailsSubmitted}
              onRefresh={handleRefresh}
              onOpenDashboard={handleOpenDashboard}
            />
            <StripeBalanceCard balance={balance} />
          </div>
        ) : (
          <StripeConnectSetup onConnect={handleConnect} />
        )}
      </div>
    </div>
  );
}
