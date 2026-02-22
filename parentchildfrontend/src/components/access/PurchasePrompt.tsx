'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PurchasePromptProps {
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

export function PurchasePrompt({
  productTitle,
  price,
  currency = 'GBP',
  productId,
  storePath,
}: PurchasePromptProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 px-4 py-3">
      <ShoppingCart className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
      <div className="flex-1 text-sm">
        <span className="font-medium">{productTitle}</span>
        {price != null && price > 0 && (
          <span className="text-muted-foreground ml-2">{formatPrice(price, currency)}</span>
        )}
      </div>
      <Button size="sm" asChild>
        <Link href={`${storePath}/${productId}`}>Buy Now</Link>
      </Button>
    </div>
  );
}
