'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ExternalLink,
  Package,
} from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getProduct, publishProduct, unpublishProduct, deleteProduct } from 'src/lib/product-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import ProductStatusBadge from 'src/components/products/ProductStatusBadge';
import ProductStatsCard from 'src/components/products/ProductStatsCard';

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

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!activeCompanyId || !productId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getProduct(activeCompanyId, productId);
      setProduct(data?.product || data);
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  async function handlePublish() {
    try {
      await publishProduct(activeCompanyId, productId);
      await loadProduct();
    } catch (err) {
      setError(err.message || 'Failed to publish');
    }
  }

  async function handleUnpublish() {
    try {
      await unpublishProduct(activeCompanyId, productId);
      await loadProduct();
    } catch (err) {
      setError(err.message || 'Failed to unpublish');
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteProduct(activeCompanyId, productId);
      router.push(paths.dashboard.products.root);
    } catch (err) {
      setError(err.message || 'Failed to delete');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container max-w-screen-md mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  const pricing = product.pricing || {};
  const isActive = product.status === 'active';

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.products.root)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{product.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{TYPE_LABELS[product.type] || product.type}</Badge>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(paths.dashboard.products.edit(productId))}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
          </Button>
          {isActive ? (
            <Button variant="outline" size="sm" onClick={handleUnpublish}>
              <ArrowDownCircle className="mr-1 h-3.5 w-3.5" /> Unpublish
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePublish}>
              <ArrowUpCircle className="mr-1 h-3.5 w-3.5" /> Publish
            </Button>
          )}
          {isActive && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/store/${productId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3.5 w-3.5" /> View in Store
              </a>
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
          </Button>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200 mb-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Yes, Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-2">Sales Performance</h3>
          <ProductStatsCard
            purchaseCount={product.purchaseCount}
            revenue={product.totalRevenue}
            currency={pricing.currency}
          />
        </div>

        {/* Description */}
        {product.description && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        {/* Pricing */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Pricing</h3>
          {pricing.isFree ? (
            <span className="text-lg font-bold text-green-600 dark:text-green-400">FREE</span>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {formatPrice(pricing.basePrice, pricing.currency)}
                </span>
                <span className="text-sm text-muted-foreground">{pricing.currency}</span>
              </div>
              {pricing.discountPrice != null && pricing.discountValidUntil && (
                <div className="text-sm text-muted-foreground">
                  Discount: {formatPrice(pricing.discountPrice, pricing.currency)} until{' '}
                  {new Date(pricing.discountValidUntil).toLocaleDateString()}
                  {new Date(pricing.discountValidUntil) < new Date() && (
                    <Badge variant="secondary" className="ml-2">Expired</Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add-ons */}
        {product.addOns?.length > 0 && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium mb-3">Add-on Services</h3>
            <div className="flex flex-col gap-2">
              {product.addOns.map((addOn, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{addOn.title}</span>
                    {addOn.description && (
                      <span className="text-muted-foreground ml-2">{addOn.description}</span>
                    )}
                  </div>
                  <span>{formatPrice(addOn.price, pricing.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bundle items */}
        {product.type === 'bundle' && product.bundleItems?.length > 0 && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium mb-3">
              Bundle Items ({product.bundleItems.length})
            </h3>
            <div className="flex flex-col gap-2">
              {product.bundleItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{item.title || item.productId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {product.category && (
              <div>
                <span className="text-muted-foreground">Category: </span>
                <span>{product.category}</span>
              </div>
            )}
            {product.yearGroup && (
              <div>
                <span className="text-muted-foreground">Year Group: </span>
                <span>{product.yearGroup}</span>
              </div>
            )}
            {product.subject && (
              <div>
                <span className="text-muted-foreground">Subject: </span>
                <span>{product.subject}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
