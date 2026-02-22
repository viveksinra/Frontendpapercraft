'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { startBulkImport, confirmImport, getImportJobStatus } from 'src/lib/question-api';
import { getSubjectTree } from 'src/lib/subject-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import ImportWizard from 'src/components/question-bank/ImportWizard';

export default function ImportPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [subjects, setSubjects] = useState([]);
  const [importJob, setImportJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;
    getSubjectTree(companyId).then((data) => {
      setSubjects(data.subjects || []);
    }).catch(() => {});
  }, [companyId]);

  const handleStartImport = async (data) => {
    try {
      setError(null);
      const result = await startBulkImport(companyId, data);
      setImportJob(result.job || result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to start import');
      throw err;
    }
  };

  const handleConfirmImport = async (data) => {
    if (!importJob) return;
    try {
      setError(null);
      const jobId = importJob._id || importJob.id;
      const result = await confirmImport(companyId, jobId, data);
      setImportJob(result.job || result);
    } catch (err) {
      setError(err.message || 'Failed to confirm import');
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.questionBank.root)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bulk Import</h1>
            <p className="text-sm text-muted-foreground">
              Import questions from CSV or DOCX files
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <ImportWizard
              subjects={subjects}
              onStartImport={handleStartImport}
              onConfirmImport={handleConfirmImport}
              importJob={importJob}
              onDone={() => router.push(paths.dashboard.questionBank.root)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
