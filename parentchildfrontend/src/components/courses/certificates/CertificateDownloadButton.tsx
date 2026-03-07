'use client';

import { useState } from 'react';
import { downloadCertificate } from '@/lib/course-api';
import { Download, Loader2 } from 'lucide-react';

interface CertificateDownloadButtonProps {
  courseId: string;
}

export default function CertificateDownloadButton({ courseId }: CertificateDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const data = await downloadCertificate(courseId);
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-accent disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      Download
    </button>
  );
}
