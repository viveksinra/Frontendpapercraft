'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SectionEditor({ section, onChange }) {
  const update = (field, value) => {
    onChange({ ...section, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-2">
        <Label>Section Name</Label>
        <Input value={section.name || ''} onChange={(e) => update('name', e.target.value)} placeholder="Section A" />
      </div>
      <div>
        <Label>Time Limit (min)</Label>
        <Input type="number" min={0} value={section.timeLimitMinutes || ''} onChange={(e) => update('timeLimitMinutes', Number(e.target.value) || undefined)} placeholder="Optional" />
      </div>
      <div className="sm:col-span-3">
        <Label>Instructions</Label>
        <Input value={section.instructions || ''} onChange={(e) => update('instructions', e.target.value)} placeholder="Answer all questions in this section..." />
      </div>
    </div>
  );
}
