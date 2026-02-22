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
    <div className="space-y-6">
      {/* Paper & Font */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Paper & Font</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Paper Size</Label>
            <Select
              value={formatting.paperSize || 'A4'}
              onValueChange={(v) => update('paperSize', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Font Family</Label>
            <Select
              value={formatting.fontFamily || 'Times New Roman'}
              onValueChange={(v) => update('fontFamily', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Calibri">Calibri</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Font Size (pt)</Label>
            <Input
              type="number"
              min={8}
              max={24}
              value={formatting.fontSize || 12}
              onChange={(e) => update('fontSize', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Line Spacing</Label>
            <Input
              type="number"
              min={1}
              max={3}
              step={0.1}
              value={formatting.lineSpacing || 1.5}
              onChange={(e) => update('lineSpacing', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Margins */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Margins (mm)</p>
        <div className="rounded-lg border p-4">
          {/* Top margin */}
          <div className="mx-auto mb-3 w-32">
            <Label className="text-xs text-center block mb-1">Top</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={formatting.marginTop || 20}
              onChange={(e) => update('marginTop', Number(e.target.value))}
              className="h-8 text-center text-xs"
            />
          </div>
          {/* Left & Right */}
          <div className="flex items-center justify-between gap-3">
            <div className="w-24">
              <Label className="text-xs block mb-1">Left</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formatting.marginLeft || 15}
                onChange={(e) => update('marginLeft', Number(e.target.value))}
                className="h-8 text-center text-xs"
              />
            </div>
            <div className="flex-1 rounded border border-dashed border-muted-foreground/30 h-16" />
            <div className="w-24">
              <Label className="text-xs block mb-1 text-right">Right</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formatting.marginRight || 15}
                onChange={(e) => update('marginRight', Number(e.target.value))}
                className="h-8 text-center text-xs"
              />
            </div>
          </div>
          {/* Bottom margin */}
          <div className="mx-auto mt-3 w-32">
            <Label className="text-xs text-center block mb-1">Bottom</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={formatting.marginBottom || 20}
              onChange={(e) => update('marginBottom', Number(e.target.value))}
              className="h-8 text-center text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
