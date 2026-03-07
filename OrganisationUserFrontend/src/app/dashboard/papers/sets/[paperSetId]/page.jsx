'use client';

import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { listPapers } from 'src/lib/paper-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  uploadPdf,
  getPaperSet,
  downloadZip,
  addPaperToSet,
  updatePaperSet,
  publishPaperSet,
  archivePaperSet,
  removePaperFromSet,
} from 'src/lib/paper-set-api';

import { Button } from '@/components/ui/button';
import PaperSetDetail from 'src/components/paper-sets/PaperSetDetail';

export default function PaperSetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paperSetId = params.paperSetId;
  const companyId = getActiveCompanyIdFromCookie();

  const [paperSet, setPaperSet] = useState(null);
  const [availablePapers, setAvailablePapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!companyId || !paperSetId) return;
    try {
      setLoading(true);
      const [setData, papersData] = await Promise.all([
        getPaperSet(companyId, paperSetId),
        listPapers(companyId, { status: 'finalized', limit: 100 }),
      ]);
      setPaperSet(setData.paperSet || setData);
      setAvailablePapers(papersData.papers || papersData.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load paper set');
    } finally {
      setLoading(false);
    }
  }, [companyId, paperSetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddPaper = async (paperId) => {
    try {
      await addPaperToSet(companyId, paperSetId, paperId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add paper');
    }
  };

  const handleRemovePaper = async (paperId) => {
    try {
      await removePaperFromSet(companyId, paperSetId, paperId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to remove paper');
    }
  };

  const handlePublish = async () => {
    try {
      await publishPaperSet(companyId, paperSetId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to publish');
    }
  };

  const handleArchive = async () => {
    try {
      await archivePaperSet(companyId, paperSetId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to archive');
    }
  };

  const handleDownloadZip = async () => {
    try {
      const blob = await downloadZip(companyId, paperSetId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paper-set-${paperSetId}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to download ZIP');
    }
  };

  const handleUploadPdf = async (file, paperIndex, pdfType) => {
    try {
      setUploading(true);
      await uploadPdf(companyId, paperSetId, file, paperIndex, pdfType);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePricing = async (pricing) => {
    try {
      await updatePaperSet(companyId, paperSetId, { pricing });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update pricing');
    }
  };

  if (!companyId) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">No active company selected.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.papers.sets)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Paper Sets
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Paper Set Details</h1>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <PaperSetDetail
            paperSet={paperSet}
            availablePapers={availablePapers}
            onAddPaper={handleAddPaper}
            onRemovePaper={handleRemovePaper}
            onPublish={handlePublish}
            onArchive={handleArchive}
            onDownloadZip={handleDownloadZip}
            onUploadPdf={handleUploadPdf}
            onUpdatePricing={handleUpdatePricing}
            uploading={uploading}
          />
        )}
      </div>
    </div>
  );
}
