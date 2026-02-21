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

export default function HeaderEditor({ header = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Header Settings</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Show Logo</Label>
          <Select value={header.showLogo ? 'yes' : 'no'} onValueChange={(v) => update('showLogo', v === 'yes')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Logo Position</Label>
          <Select value={header.logoPosition || 'left'} onValueChange={(v) => update('logoPosition', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Title</Label>
          <Input value={header.title || ''} onChange={(e) => update('title', e.target.value)} placeholder="Paper title" />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input value={header.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="Subtitle" />
        </div>
      </div>
      <div>
        <Label>Show Student Info</Label>
        <Select value={header.showStudentInfo ? 'yes' : 'no'} onValueChange={(v) => update('showStudentInfo', v === 'yes')}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
