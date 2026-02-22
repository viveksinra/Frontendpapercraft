'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
    <div className="space-y-5">
      {/* Logo toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Show Logo</Label>
          <p className="text-xs text-muted-foreground">Display your organisation logo</p>
        </div>
        <Switch
          checked={!!header.showLogo}
          onCheckedChange={(v) => update('showLogo', v)}
        />
      </div>

      {/* Logo position - only show when logo is enabled */}
      {header.showLogo && (
        <div className="space-y-1.5 pl-1">
          <Label>Logo Position</Label>
          <Select
            value={header.logoPosition || 'left'}
            onValueChange={(v) => update('logoPosition', v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          value={header.title || ''}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Mathematics Final Exam"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Subtitle</Label>
        <Input
          value={header.subtitle || ''}
          onChange={(e) => update('subtitle', e.target.value)}
          placeholder="e.g. Grade 10 - Term 2"
        />
      </div>

      {/* Student info toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Student Info Fields</Label>
          <p className="text-xs text-muted-foreground">Show Name and Date fields</p>
        </div>
        <Switch
          checked={!!header.showStudentInfo}
          onCheckedChange={(v) => update('showStudentInfo', v)}
        />
      </div>
    </div>
  );
}
