'use client';

import { useRouter } from 'next/navigation';
import { Eye, Pencil, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import ProductStatusBadge from './ProductStatusBadge';
import ProductStatsCard from './ProductStatsCard';

// ─────────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  paper: 'Paper',
  paper_set: 'Paper Set',
  test: 'Test',
  bundle: 'Bundle',
};

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function ProductCard({ product, onPublish, onUnpublish }) {
  const router = useRouter();
  const id = product._id || product.id;
  const pricing = product.pricing || {};
  const isActive = product.status === 'active';
  const isDraft = product.status === 'draft';

  const effectivePrice = pricing.isFree
    ? 0
    : pricing.discountPrice != null &&
        pricing.discountValidUntil &&
        new Date(pricing.discountValidUntil) > new Date()
      ? pricing.discountPrice
      : pricing.basePrice || 0;

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      {/* Header: title + type + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-semibold truncate">{product.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{TYPE_LABELS[product.type] || product.type}</Badge>
            <ProductStatusBadge status={product.status} />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        {pricing.isFree ? (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">FREE</span>
        ) : (
          <>
            {pricing.discountPrice != null &&
              pricing.discountValidUntil &&
              new Date(pricing.discountValidUntil) > new Date() && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(pricing.basePrice, pricing.currency)}
                </span>
              )}
            <span className="text-sm font-medium">
              {formatPrice(effectivePrice, pricing.currency)}
            </span>
          </>
        )}
        {product.addOns?.length > 0 && (
          <span className="text-xs text-muted-foreground">
            + {product.addOns.length} add-on{product.addOns.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats */}
      <ProductStatsCard
        purchaseCount={product.purchaseCount}
        revenue={product.totalRevenue}
        currency={pricing.currency}
      />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(paths.dashboard.products.detail(id))}
        >
          <Eye className="mr-1 h-3.5 w-3.5" /> View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(paths.dashboard.products.edit(id))}
        >
          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
        </Button>
        {isDraft || product.status === 'inactive' ? (
          <Button variant="ghost" size="sm" onClick={() => onPublish?.(id)}>
            <ArrowUpCircle className="mr-1 h-3.5 w-3.5" /> Publish
          </Button>
        ) : isActive ? (
          <Button variant="ghost" size="sm" onClick={() => onUnpublish?.(id)}>
            <ArrowDownCircle className="mr-1 h-3.5 w-3.5" /> Unpublish
          </Button>
        ) : null}
      </div>
    </div>
  );
}
