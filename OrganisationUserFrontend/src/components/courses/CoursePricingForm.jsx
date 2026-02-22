'use client';

import { Input } from '@/components/ui/input';

export default function CoursePricingForm({ pricing = {}, onChange }) {
  const isFree = pricing.isFree !== false;

  function update(field, value) {
    onChange({ ...pricing, [field]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Pricing</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => update('isFree', true)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              isFree ? 'bg-primary text-primary-foreground' : 'bg-transparent'
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => update('isFree', false)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              !isFree ? 'bg-primary text-primary-foreground' : 'bg-transparent'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {!isFree && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={pricing.basePrice || ''}
              onChange={(e) => update('basePrice', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">Currency</label>
            <select
              value={pricing.currency || 'GBP'}
              onChange={(e) => update('currency', e.target.value)}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
