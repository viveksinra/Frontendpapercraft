'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { verifyCheckout } from '@/lib/store-api';

interface CheckoutSuccessPageProps {
  sessionId: string;
  storePath: string;
  childName?: string;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function CheckoutSuccessPage({ sessionId, storePath, childName }: CheckoutSuccessPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const data = await verifyCheckout(sessionId);
        if (!cancelled) setPurchase(data?.purchase || data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to verify payment');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-sm text-muted-foreground">Verifying payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="mt-3 text-sm text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={storePath}>Back to Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Your purchase has been confirmed and access has been granted.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2 text-sm">
          {purchase?.productTitle && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium">{purchase.productTitle}</span>
            </div>
          )}
          {purchase?.amount != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {formatPrice(purchase.amount, purchase.currency)}
              </span>
            </div>
          )}
          {purchase?.addOns?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Add-ons</span>
              <span>{purchase.addOns.map((a: any) => a.title).join(', ')}</span>
            </div>
          )}
          {childName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Access granted to</span>
              <span className="font-medium">{childName}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {purchase?.receiptUrl && (
          <Button variant="outline" asChild>
            <a href={purchase.receiptUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Receipt
            </a>
          </Button>
        )}
        <Button asChild>
          <Link href={storePath}>Back to Store</Link>
        </Button>
      </div>
    </div>
  );
}
