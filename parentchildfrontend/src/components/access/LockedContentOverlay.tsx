'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LockedContentOverlayProps {
  productTitle: string;
  price?: number;
  currency?: string;
  productId: string;
  storePath: string;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function LockedContentOverlay({
  productTitle,
  price,
  currency = 'GBP',
  productId,
  storePath,
}: LockedContentOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10">
      <Lock className="h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-sm font-medium mb-1">{productTitle}</p>
      {price != null && price > 0 && (
        <p className="text-sm text-muted-foreground mb-3">
          {formatPrice(price, currency)}
        </p>
      )}
      <div className="flex gap-2">
        <Button size="sm" asChild>
          <Link href={`${storePath}/${productId}`}>Purchase to Access</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={storePath}>View Store</Link>
        </Button>
      </div>
    </div>
  );
}
