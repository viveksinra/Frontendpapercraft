'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function FooterEditor({ footer = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...footer, [field]: value });
  };

  return (
    <div className="space-y-5">
      {/* Page numbers toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Page Numbers</Label>
          <p className="text-xs text-muted-foreground">Show page numbers at the bottom</p>
        </div>
        <Switch
          checked={!!footer.showPageNumbers}
          onCheckedChange={(v) => update('showPageNumbers', v)}
        />
      </div>

      {/* Copyright */}
      <div className="space-y-1.5">
        <Label>Copyright Text</Label>
        <Input
          value={footer.copyrightText || ''}
          onChange={(e) => update('copyrightText', e.target.value)}
          placeholder="e.g. © 2026 Your Organisation"
        />
        <p className="text-xs text-muted-foreground">Displayed at the bottom of every page</p>
      </div>

      {/* Watermark toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="text-sm font-medium">Watermark</Label>
          <p className="text-xs text-muted-foreground">Overlay text across each page</p>
        </div>
        <Switch
          checked={!!footer.showWatermark}
          onCheckedChange={(v) => update('showWatermark', v)}
        />
      </div>

      {/* Watermark text - only show when enabled */}
      {footer.showWatermark && (
        <div className="space-y-1.5 pl-1">
          <Label>Watermark Text</Label>
          <Input
            value={footer.watermarkText || ''}
            onChange={(e) => update('watermarkText', e.target.value)}
            placeholder="e.g. CONFIDENTIAL"
          />
        </div>
      )}
    </div>
  );
}
