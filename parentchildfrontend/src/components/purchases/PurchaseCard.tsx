'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  pending: 'secondary',
  failed: 'destructive',
  refunded: 'outline',
  expired: 'outline',
};

const STATUS_LABEL: Record<string, string> = {
  completed: 'Purchased',
  pending: 'Processing',
  failed: 'Failed',
  refunded: 'Refunded',
  expired: 'Expired',
};

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

interface PurchaseCardProps {
  purchase: any;
  storePath: string;
}

export function PurchaseCard({ purchase, storePath }: PurchaseCardProps) {
  const isFree = purchase.amount === 0;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{purchase.productTitle || 'Untitled Product'}</h3>
          <Badge variant={STATUS_VARIANT[purchase.status] || 'outline'}>
            {STATUS_LABEL[purchase.status] || purchase.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {new Date(purchase.createdAt || purchase.purchaseDate).toLocaleDateString()}
          </span>
          <span className="font-medium text-foreground">
            {isFree ? 'FREE' : formatPrice(purchase.amount, purchase.currency)}
          </span>
        </div>

        {purchase.addOns?.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Add-ons: {purchase.addOns.map((a: any) => a.title).join(', ')}
          </div>
        )}

        {purchase.childName && (
          <div className="text-xs text-muted-foreground">
            Purchased for: {purchase.childName}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {purchase.status === 'completed' && purchase.receiptUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={purchase.receiptUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Receipt
              </a>
            </Button>
          )}
          {purchase.status === 'failed' && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`${storePath}/${purchase.productId}`}>Try Again</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
