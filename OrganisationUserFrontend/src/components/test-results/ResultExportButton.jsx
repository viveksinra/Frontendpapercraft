'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import axiosInstance from '@/lib/axios';
import { v2Endpoints } from '@/lib/v2-endpoints';

import { Button } from '@/components/ui/button';

export default function ResultExportButton({ companyId, testId }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!companyId || !testId) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        v2Endpoints.onlineTests.exportResults(companyId, testId),
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-results-${testId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Export CSV
    </Button>
  );
}
