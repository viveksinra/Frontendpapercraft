'use client';

import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PdfGenerationStatus({ status }) {
  if (status === 'generating') {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Generating PDFs...
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        PDFs ready
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertTriangle className="h-4 w-4" />
        PDF generation failed
      </div>
    );
  }

  return null;
}
