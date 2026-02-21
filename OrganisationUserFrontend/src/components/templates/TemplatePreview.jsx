'use client';

import { Card } from '@/components/ui/card';

export default function TemplatePreview({ layout = {} }) {
  const header = layout.header || {};
  const footer = layout.footer || {};
  const formatting = layout.formatting || {};
  const instructions = layout.instructions || {};

  const fontFamily = formatting.fontFamily || 'Times New Roman';
  const fontSize = formatting.fontSize || 12;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="text-xs bg-muted px-3 py-1.5 font-medium border-b">Live Preview</div>
      <div
        className="bg-white border mx-4 my-3 shadow-sm"
        style={{
          fontFamily,
          fontSize: `${Math.max(fontSize * 0.6, 7)}px`,
          padding: `${(formatting.marginTop || 20) * 0.4}px ${(formatting.marginRight || 15) * 0.4}px ${(formatting.marginBottom || 20) * 0.4}px ${(formatting.marginLeft || 15) * 0.4}px`,
          minHeight: 280,
          lineHeight: formatting.lineSpacing || 1.5,
        }}
      >
        {/* Header */}
        <div className="border-b pb-1 mb-2" style={{ textAlign: header.logoPosition || 'center' }}>
          {header.showLogo && <div className="inline-block w-6 h-6 bg-muted rounded mb-1" />}
          {header.title && <div className="font-bold" style={{ fontSize: `${Math.max(fontSize * 0.8, 9)}px` }}>{header.title}</div>}
          {header.subtitle && <div className="text-muted-foreground">{header.subtitle}</div>}
          {header.showStudentInfo && (
            <div className="flex gap-3 mt-1 text-muted-foreground">
              <span>Name: ________</span>
              <span>Date: ________</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {instructions.text && (
          <div className="bg-muted/50 rounded p-1 mb-2 text-muted-foreground italic">
            {instructions.text}
          </div>
        )}

        {/* Mock content */}
        <div className="space-y-2">
          <div className="font-semibold">Section A</div>
          <div className="pl-2 space-y-1">
            <div>1. Sample question line goes here ___________</div>
            <div className="pl-3 text-muted-foreground">(a) Option A &nbsp; (b) Option B &nbsp; (c) Option C &nbsp; (d) Option D</div>
            <div>2. Another sample question ___________</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-auto pt-1 flex justify-between text-muted-foreground" style={{ marginTop: 16 }}>
          {footer.copyrightText && <span>{footer.copyrightText}</span>}
          {footer.showPageNumbers && <span>Page 1 of 4</span>}
        </div>

        {/* Watermark overlay */}
        {footer.showWatermark && footer.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 text-4xl font-bold rotate-[-30deg]">
            {footer.watermarkText}
          </div>
        )}
      </div>
    </Card>
  );
}
