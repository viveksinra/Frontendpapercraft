'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

export default function PaperSetPricingForm({ pricing = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...pricing, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Pricing</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Free</Label>
          <Select value={pricing.isFree ? 'yes' : 'no'} onValueChange={(v) => update('isFree', v === 'yes')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes (Free)</SelectItem>
              <SelectItem value="no">No (Paid)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!pricing.isFree && (
          <>
            <div>
              <Label>Currency</Label>
              <Select value={pricing.currency || 'GBP'} onValueChange={(v) => update('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Per-Paper Price</Label>
              <Input type="number" min={0} step={0.01} value={pricing.perPaperPrice || ''} onChange={(e) => update('perPaperPrice', Number(e.target.value))} placeholder="0.00" />
            </div>
            <div>
              <Label>Bundle Price</Label>
              <Input type="number" min={0} step={0.01} value={pricing.bundlePrice || ''} onChange={(e) => update('bundlePrice', Number(e.target.value))} placeholder="0.00" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
