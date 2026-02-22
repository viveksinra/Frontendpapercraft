'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, Package } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { getProductDetail, createCheckoutSession, claimFreeAccess, checkAccess } from '@/lib/store-api';
import { AddOnSelector } from './AddOnSelector';
import { PriceSummary } from './PriceSummary';
import { BuyButton } from './BuyButton';

const TYPE_LABELS: Record<string, string> = {
  paper: 'Paper',
  paper_set: 'Paper Set',
  test: 'Test',
  bundle: 'Bundle',
};

interface ProductDetailPageProps {
  companyId: string;
  productId: string;
  studentUserId?: string;
  storePath: string;
  successPath: string;
}

export function ProductDetailPage({
  companyId,
  productId,
  studentUserId,
  storePath,
  successPath,
}: ProductDetailPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    if (!companyId || !productId) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductDetail(companyId, productId);
        if (!cancelled) {
          setProduct(data?.product || data);

          // Check if already purchased
          try {
            const refType = data?.product?.type || data?.type;
            const refId = data?.product?.referenceId || data?.referenceId;
            if (refType && refId) {
              const access = await checkAccess(refType, refId);
              if (access?.hasAccess) setAlreadyPurchased(true);
            }
          } catch (_) {
            // Access check failure is non-critical
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [companyId, productId]);

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleBuy() {
    const payload: any = { productId };
    if (studentUserId) payload.studentUserId = studentUserId;
    if (selectedAddOnIds.length > 0) payload.selectedAddOns = selectedAddOnIds;

    const result = await createCheckoutSession(payload);
    if (result?.checkoutUrl || result?.url) {
      window.location.href = result.checkoutUrl || result.url;
    }
  }

  async function handleClaimFree() {
    const payload: any = { productId };
    if (studentUserId) payload.studentUserId = studentUserId;

    await claimFreeAccess(payload);
    window.location.href = successPath;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error || 'Product not found'}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={storePath}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
        </Button>
      </div>
    );
  }

  const pricing = product.pricing || {};
  const isFree = pricing.isFree;
  const hasActiveDiscount =
    pricing.discountPrice != null &&
    pricing.discountValidUntil &&
    new Date(pricing.discountValidUntil) > new Date();
  const effectivePrice = isFree ? 0 : hasActiveDiscount ? pricing.discountPrice : pricing.basePrice || 0;
  const addOns = product.addOns || [];
  const selectedAddOns = addOns
    .filter((_: any, i: number) => selectedAddOnIds.includes(String(i)))
    .map((a: any) => ({ title: a.title, price: a.price }));
  const total = effectivePrice + selectedAddOns.reduce((s: number, a: any) => s + a.price, 0);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={storePath}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{TYPE_LABELS[product.type] || product.type}</Badge>
            {product.yearGroup && <Badge variant="secondary">{product.yearGroup}</Badge>}
            {product.subject && <Badge variant="secondary">{product.subject}</Badge>}
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{product.title}</h1>

          {product.description && (
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          )}

          {/* Bundle items */}
          {product.type === 'bundle' && product.bundleItems?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">What&apos;s Included</h3>
              <div className="space-y-1">
                {product.bundleItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{item.title || item.productId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: pricing + buy */}
        <div className="space-y-4">
          {/* Add-ons */}
          {!isFree && addOns.length > 0 && (
            <AddOnSelector
              addOns={addOns.map((a: any, i: number) => ({ ...a, _id: String(i) }))}
              selectedIds={selectedAddOnIds}
              onToggle={toggleAddOn}
              currency={pricing.currency}
            />
          )}

          {/* Price summary */}
          <PriceSummary
            basePrice={pricing.basePrice || 0}
            discountPrice={hasActiveDiscount ? pricing.discountPrice : null}
            isFree={isFree}
            selectedAddOns={selectedAddOns}
            currency={pricing.currency}
          />

          {/* Buy button */}
          <BuyButton
            isFree={isFree}
            isAlreadyPurchased={alreadyPurchased}
            total={total}
            currency={pricing.currency}
            onBuy={handleBuy}
            onClaimFree={handleClaimFree}
          />
        </div>
      </div>
    </div>
  );
}
