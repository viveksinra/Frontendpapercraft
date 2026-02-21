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

export default function FooterEditor({ footer = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...footer, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Footer Settings</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Show Page Numbers</Label>
          <Select value={footer.showPageNumbers ? 'yes' : 'no'} onValueChange={(v) => update('showPageNumbers', v === 'yes')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Copyright Text</Label>
          <Input value={footer.copyrightText || ''} onChange={(e) => update('copyrightText', e.target.value)} placeholder="(c) 2026 Your Org" />
        </div>
        <div>
          <Label>Show Watermark</Label>
          <Select value={footer.showWatermark ? 'yes' : 'no'} onValueChange={(v) => update('showWatermark', v === 'yes')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Watermark Text</Label>
          <Input value={footer.watermarkText || ''} onChange={(e) => update('watermarkText', e.target.value)} placeholder="CONFIDENTIAL" />
        </div>
      </div>
    </div>
  );
}
