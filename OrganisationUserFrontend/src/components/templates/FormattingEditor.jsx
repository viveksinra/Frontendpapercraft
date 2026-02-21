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

export default function FormattingEditor({ formatting = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...formatting, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Formatting</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Paper Size</Label>
          <Select value={formatting.paperSize || 'A4'} onValueChange={(v) => update('paperSize', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="A3">A3</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Family</Label>
          <Select value={formatting.fontFamily || 'Times New Roman'} onValueChange={(v) => update('fontFamily', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Calibri">Calibri</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Size (pt)</Label>
          <Input type="number" min={8} max={24} value={formatting.fontSize || 12} onChange={(e) => update('fontSize', Number(e.target.value))} />
        </div>
        <div>
          <Label>Line Spacing</Label>
          <Input type="number" min={1} max={3} step={0.1} value={formatting.lineSpacing || 1.5} onChange={(e) => update('lineSpacing', Number(e.target.value))} />
        </div>
        <div>
          <Label>Top Margin (mm)</Label>
          <Input type="number" min={0} max={100} value={formatting.marginTop || 20} onChange={(e) => update('marginTop', Number(e.target.value))} />
        </div>
        <div>
          <Label>Bottom Margin (mm)</Label>
          <Input type="number" min={0} max={100} value={formatting.marginBottom || 20} onChange={(e) => update('marginBottom', Number(e.target.value))} />
        </div>
        <div>
          <Label>Left Margin (mm)</Label>
          <Input type="number" min={0} max={100} value={formatting.marginLeft || 15} onChange={(e) => update('marginLeft', Number(e.target.value))} />
        </div>
        <div>
          <Label>Right Margin (mm)</Label>
          <Input type="number" min={0} max={100} value={formatting.marginRight || 15} onChange={(e) => update('marginRight', Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
}
