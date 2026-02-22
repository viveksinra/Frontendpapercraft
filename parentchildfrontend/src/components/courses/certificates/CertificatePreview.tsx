'use client';

import { Award } from 'lucide-react';

interface CertificatePreviewProps {
  certificate: any;
}

export default function CertificatePreview({ certificate }: CertificatePreviewProps) {
  return (
    <div className="aspect-[1.4/1] bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 rounded-md border flex flex-col items-center justify-center p-4 text-center">
      <Award className="h-8 w-8 text-amber-600 mb-2" />
      <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 line-clamp-2">
        {certificate.courseTitle || 'Certificate of Completion'}
      </p>
      <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1">
        {certificate.instituteName || ''}
      </p>
    </div>
  );
}
