'use client';

import { Download } from 'lucide-react';

interface PdfLessonProps {
  pdfUrl: string;
  fileName?: string;
}

export default function PdfLesson({ pdfUrl, fileName }: PdfLessonProps) {
  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">PDF not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{fileName || 'Document'}</span>
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-accent"
        >
          <Download className="h-3 w-3" /> Download
        </a>
      </div>
      <iframe
        src={pdfUrl}
        className="w-full h-[600px] md:h-[700px] rounded-lg border"
        title={fileName || 'PDF Viewer'}
      />
    </div>
  );
}
