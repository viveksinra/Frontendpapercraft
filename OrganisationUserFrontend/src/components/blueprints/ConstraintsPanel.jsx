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

export default function ConstraintsPanel({ constraints = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...constraints, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Constraints</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Exclude Recently Used</Label>
          <Select
            value={constraints.excludeRecentlyUsed ? 'yes' : 'no'}
            onValueChange={(v) => update('excludeRecentlyUsed', v === 'yes')}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {constraints.excludeRecentlyUsed && (
          <div>
            <Label>Window (days)</Label>
            <Input
              type="number"
              min={1}
              max={365}
              value={constraints.recentlyUsedWindowDays || 90}
              onChange={(e) => update('recentlyUsedWindowDays', Number(e.target.value))}
            />
          </div>
        )}
        <div>
          <Label>Approved Questions Only</Label>
          <Select
            value={constraints.approvedOnly !== false ? 'yes' : 'no'}
            onValueChange={(v) => update('approvedOnly', v === 'yes')}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
