'use client';

import { useState } from 'react';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

export default function StripeConnectSetup({ onConnect }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConnect() {
    try {
      setConnecting(true);
      setError(null);
      const result = await onConnect();
      if (result?.onboardingUrl) {
        window.location.href = result.onboardingUrl;
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate Stripe Connect');
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CreditCard className="h-7 w-7 text-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Connect Your Stripe Account</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect a Stripe account to start accepting payments for your papers, tests, and bundles.
            You&apos;ll be redirected to Stripe to complete the setup.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200 w-full">
            {error}
          </div>
        )}

        <Button onClick={handleConnect} disabled={connecting} size="lg">
          {connecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="mr-2 h-4 w-4" />
          )}
          Connect with Stripe
        </Button>

        <p className="text-xs text-muted-foreground">
          Stripe handles all payment processing securely. PaperCraft never stores card details.
        </p>
      </div>
    </div>
  );
}
