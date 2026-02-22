'use client';

export default function TemplatePreview({ layout = {} }) {
  const header = layout.header || {};
  const footer = layout.footer || {};
  const formatting = layout.formatting || {};
  const instructions = layout.instructions || {};

  const fontFamily = formatting.fontFamily || 'Times New Roman';
  const fontSize = formatting.fontSize || 12;

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div
        className="relative bg-white text-neutral-900"
        style={{
          fontFamily,
          fontSize: `${Math.max(fontSize * 0.6, 7)}px`,
          padding: `${(formatting.marginTop || 20) * 0.4}px ${(formatting.marginRight || 15) * 0.4}px ${(formatting.marginBottom || 20) * 0.4}px ${(formatting.marginLeft || 15) * 0.4}px`,
          minHeight: 300,
          lineHeight: formatting.lineSpacing || 1.5,
        }}
      >
        {/* Header */}
        <div
          className="border-b border-neutral-200 pb-1 mb-2"
          style={{ textAlign: header.logoPosition || 'center' }}
        >
          {header.showLogo && (
            <div className="inline-block w-6 h-6 bg-neutral-200 rounded mb-1" />
          )}
          {header.title && (
            <div className="font-bold" style={{ fontSize: `${Math.max(fontSize * 0.8, 9)}px` }}>
              {header.title}
            </div>
          )}
          {header.subtitle && (
            <div className="text-neutral-500">{header.subtitle}</div>
          )}
          {header.showStudentInfo && (
            <div className="flex gap-3 mt-1 text-neutral-500">
              <span>Name: ________</span>
              <span>Date: ________</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {instructions.text && (
          <div className="bg-neutral-50 rounded p-1.5 mb-2 text-neutral-500 italic text-[0.65rem]">
            {instructions.text}
          </div>
        )}

        {/* Mock content */}
        <div className="space-y-2">
          <div className="font-semibold">Section A</div>
          <div className="pl-2 space-y-1">
            <div>1. Sample question line goes here ___________</div>
            <div className="pl-3 text-neutral-500">
              (a) Option A &nbsp; (b) Option B &nbsp; (c) Option C &nbsp; (d) Option D
            </div>
            <div>2. Another sample question ___________</div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-neutral-200 mt-auto pt-1 flex justify-between text-neutral-500"
          style={{ marginTop: 20 }}
        >
          {footer.copyrightText && <span>{footer.copyrightText}</span>}
          {footer.showPageNumbers && <span>Page 1 of 4</span>}
        </div>

        {/* Watermark overlay */}
        {footer.showWatermark && footer.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] text-4xl font-bold rotate-[-30deg] text-neutral-900">
            {footer.watermarkText}
          </div>
        )}
      </div>
    </div>
  );
}
