'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: any;
  basePath: string;
}

const TYPE_LABELS: Record<string, string> = {
  paper: 'Paper',
  paper_set: 'Paper Set',
  test: 'Test',
  bundle: 'Bundle',
};

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function ProductCard({ product, basePath }: ProductCardProps) {
  const id = product._id || product.id;
  const pricing = product.pricing || {};
  const isFree = pricing.isFree;

  const hasActiveDiscount =
    pricing.discountPrice != null &&
    pricing.discountValidUntil &&
    new Date(pricing.discountValidUntil) > new Date();

  const effectivePrice = isFree ? 0 : hasActiveDiscount ? pricing.discountPrice : pricing.basePrice || 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">{TYPE_LABELS[product.type] || product.type}</Badge>
          {product.yearGroup && (
            <Badge variant="secondary" className="text-xs">{product.yearGroup}</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold line-clamp-2">{product.title}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {isFree ? (
            <span className="text-sm font-bold text-green-600 dark:text-green-400">FREE</span>
          ) : (
            <>
              {hasActiveDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(pricing.basePrice, pricing.currency)}
                </span>
              )}
              <span className="text-sm font-bold">
                {formatPrice(effectivePrice, pricing.currency)}
              </span>
            </>
          )}
        </div>

        {/* Purchase count */}
        {product.purchaseCount > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            {product.purchaseCount} purchased
          </span>
        )}

        {/* Action */}
        <Button asChild size="sm" variant={isFree ? 'default' : 'outline'} className="mt-auto">
          <Link href={`${basePath}/${id}`}>
            {isFree ? 'Get Free Access' : 'View Details'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
