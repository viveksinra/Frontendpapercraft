'use client';

import { useState, useEffect } from 'react';
import { getMyCertificates } from '@/lib/course-api';
import CertificatesList from '@/components/courses/certificates/CertificatesList';
import { Loader2, AlertCircle } from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getMyCertificates({ pageSize: 100 });
        setCertificates(data.certificates || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load certificates.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Certificates</h1>
        <p className="mt-1 text-muted-foreground">
          View and download your earned certificates.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <CertificatesList certificates={certificates} />
      )}
    </div>
  );
}
