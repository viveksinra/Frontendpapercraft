'use client';

import { useState } from 'react';
import { Loader2, ShoppingCart, Gift, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface BuyButtonProps {
  isFree?: boolean;
  isAlreadyPurchased?: boolean;
  total: number;
  currency?: string;
  onBuy: () => Promise<void>;
  onClaimFree: () => Promise<void>;
  contentUrl?: string;
  disabled?: boolean;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function BuyButton({
  isFree,
  isAlreadyPurchased,
  total,
  currency = 'GBP',
  onBuy,
  onClaimFree,
  contentUrl,
  disabled,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      if (isFree) {
        await onClaimFree();
      } else {
        await onBuy();
      }
    } finally {
      setLoading(false);
    }
  }

  if (isAlreadyPurchased) {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full" variant="secondary">
          <CheckCircle className="mr-2 h-4 w-4" />
          Already Purchased
        </Button>
        {contentUrl && (
          <Button asChild variant="outline" className="w-full">
            <Link href={contentUrl}>Access Content</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleClick}
        disabled={loading || disabled}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isFree ? (
          <Gift className="mr-2 h-4 w-4" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {isFree ? 'Get Free Access' : `Buy Now - ${formatPrice(total, currency)}`}
      </Button>
      {!isFree && (
        <p className="text-xs text-center text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      )}
    </div>
  );
}
