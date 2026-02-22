'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, X, Plus } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createProduct, updateProduct, publishProduct } from 'src/lib/product-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import ProductTypeSelector from './ProductTypeSelector';
import ContentLinker from './ContentLinker';
import PricingSection from './PricingSection';
import AddOnEditor from './AddOnEditor';
import BundleItemSelector from './BundleItemSelector';

// ─────────────────────────────────────────────────────────────────

export default function CreateProductForm({ existingProduct = null }) {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();
  const isEditMode = !!existingProduct;
  const existingId = existingProduct?._id || existingProduct?.id;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    type: existingProduct?.type || '',
    title: existingProduct?.title || '',
    description: existingProduct?.description || '',
    referenceId: existingProduct?.referenceId || '',
    referenceTitle: existingProduct?.referenceTitle || '',
    pricing: {
      isFree: existingProduct?.pricing?.isFree || false,
      basePrice: existingProduct?.pricing?.basePrice ?? '',
      currency: existingProduct?.pricing?.currency || 'GBP',
      hasDiscount: !!(existingProduct?.pricing?.discountPrice != null),
      discountPrice: existingProduct?.pricing?.discountPrice ?? '',
      discountValidUntil: existingProduct?.pricing?.discountValidUntil
        ? new Date(existingProduct.pricing.discountValidUntil).toISOString().slice(0, 16)
        : '',
    },
    addOns: existingProduct?.addOns || [],
    bundleItems: existingProduct?.bundleItems || [],
    category: existingProduct?.category || '',
    yearGroup: existingProduct?.yearGroup || '',
    subject: existingProduct?.subject || '',
    tags: existingProduct?.tags || [],
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField('tags', [...form.tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag) {
    updateField('tags', form.tags.filter((t) => t !== tag));
  }

  function buildPayload() {
    const payload = {
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || undefined,
      yearGroup: form.yearGroup.trim() || undefined,
      subject: form.subject.trim() || undefined,
      tags: form.tags.length > 0 ? form.tags : undefined,
      addOns: form.addOns.length > 0
        ? form.addOns.map((a) => ({
            type: a.type,
            title: a.title,
            description: a.description,
            price: parseFloat(a.price) || 0,
          }))
        : undefined,
      pricing: {
        isFree: form.pricing.isFree,
        basePrice: form.pricing.isFree ? 0 : parseFloat(form.pricing.basePrice) || 0,
        currency: form.pricing.currency,
      },
    };

    if (form.pricing.hasDiscount && !form.pricing.isFree) {
      payload.pricing.discountPrice = parseFloat(form.pricing.discountPrice) || 0;
      payload.pricing.discountValidUntil = form.pricing.discountValidUntil
        ? new Date(form.pricing.discountValidUntil).toISOString()
        : undefined;
    }

    if (form.type !== 'bundle' && form.referenceId) {
      payload.referenceId = form.referenceId;
    }

    if (form.type === 'bundle' && form.bundleItems.length > 0) {
      payload.bundleItems = form.bundleItems.map((item) => ({
        productId: item.productId,
      }));
    }

    return payload;
  }

  async function handleSubmit(e, shouldPublish = false) {
    e.preventDefault();

    if (!form.type) {
      setError('Please select a product type');
      return;
    }
    if (!form.title.trim()) {
      setError('Product title is required');
      return;
    }
    if (!form.pricing.isFree && (!form.pricing.basePrice || form.pricing.basePrice <= 0)) {
      setError('Base price is required for paid products');
      return;
    }
    if (form.type === 'bundle' && form.bundleItems.length < 2) {
      setError('Bundles require at least 2 items');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = buildPayload();

      let productId;
      if (isEditMode) {
        await updateProduct(activeCompanyId, existingId, payload);
        productId = existingId;
      } else {
        const result = await createProduct(activeCompanyId, payload);
        productId = result?._id || result?.id || result?.product?._id;
      }

      if (shouldPublish && productId) {
        await publishProduct(activeCompanyId, productId);
      }

      router.push(productId ? paths.dashboard.products.detail(productId) : paths.dashboard.products.root);
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode
                ? 'Update product details and pricing.'
                : 'Set up a new product for your catalog.'}
            </p>
          </div>
        </div>

        {isEditMode && existingProduct?.status === 'active' && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            This product is published. Changes will take effect immediately.
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-5">
          {/* 1. Product Type */}
          <div className="flex flex-col gap-2">
            <Label>Product Type *</Label>
            <ProductTypeSelector
              value={form.type}
              onChange={(type) => updateField('type', type)}
              disabled={isEditMode}
            />
          </div>

          {/* 2. Content Link (non-bundle only) */}
          {form.type && form.type !== 'bundle' && (
            <div className="flex flex-col gap-1.5">
              <Label>Link to Content</Label>
              <ContentLinker
                type={form.type}
                value={form.referenceId ? { referenceId: form.referenceId, title: form.referenceTitle } : null}
                onChange={(val) => {
                  updateField('referenceId', val?.referenceId || '');
                  updateField('referenceTitle', val?.title || '');
                }}
                disabled={isEditMode}
              />
            </div>
          )}

          {/* 3. Bundle Items (bundle only) */}
          {form.type === 'bundle' && (
            <BundleItemSelector
              items={form.bundleItems}
              bundlePrice={form.pricing.isFree ? 0 : parseFloat(form.pricing.basePrice) || 0}
              currency={form.pricing.currency}
              onChange={(items) => updateField('bundleItems', items)}
            />
          )}

          {/* 4. Title + Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. CSSE 11+ Practice Paper Pack"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what's included..."
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* 5. Pricing */}
          <PricingSection
            pricing={form.pricing}
            onChange={(pricing) => updateField('pricing', pricing)}
          />

          {/* 6. Add-ons */}
          <AddOnEditor
            addOns={form.addOns}
            onChange={(addOns) => updateField('addOns', addOns)}
          />

          {/* 7. Metadata */}
          <div className="flex flex-col gap-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. 11+ Practice"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yearGroup">Year Group</Label>
                <Input
                  id="yearGroup"
                  placeholder="e.g. Year 5"
                  value={form.yearGroup}
                  onChange={(e) => updateField('yearGroup', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Mathematics"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <Label>Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            {isEditMode ? (
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            ) : (
              <>
                <Button type="submit" variant="outline" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSubmit(e, true)}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save & Publish
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
