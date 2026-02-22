'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ─────────────────────────────────────────────────────────────────

export default function PricingSection({ pricing, onChange }) {
  function update(field, value) {
    onChange({ ...pricing, [field]: value });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <h4 className="text-sm font-medium">Pricing</h4>

      {/* Free toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isFree"
          checked={pricing.isFree || false}
          onChange={(e) => update('isFree', e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="isFree">Free product (no charge)</Label>
      </div>

      {!pricing.isFree && (
        <>
          {/* Base price + currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="basePrice">Base Price *</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 29.99"
                value={pricing.basePrice ?? ''}
                onChange={(e) => update('basePrice', e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={pricing.currency || 'GBP'}
                onChange={(e) => update('currency', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Discount toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasDiscount"
              checked={pricing.hasDiscount || false}
              onChange={(e) => update('hasDiscount', e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="hasDiscount">Enable discount</Label>
          </div>

          {pricing.hasDiscount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 19.99"
                  value={pricing.discountPrice ?? ''}
                  onChange={(e) =>
                    update('discountPrice', e.target.value ? parseFloat(e.target.value) : '')
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="discountValidUntil">Discount Expires</Label>
                <Input
                  id="discountValidUntil"
                  type="datetime-local"
                  value={pricing.discountValidUntil || ''}
                  onChange={(e) => update('discountValidUntil', e.target.value)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
