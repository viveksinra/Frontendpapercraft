'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createPaper, downloadPdf, finalizePaper } from 'src/lib/paper-api';

import { Button } from '@/components/ui/button';
import PaperBuilderWizard from 'src/components/paper-builder/PaperBuilderWizard';

export default function CreatePaperPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();
  const [saving, setSaving] = useState(false);
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState(null);

  const handleSaveDraft = async (data) => {
    if (!companyId) return null;
    try {
      setSaving(true);
      setError(null);

      // Build payload for the API
      const payload = {
        title: data.title,
        description: data.description,
        templateId: data.templateId,
        sections: (data.sections || []).map((s) => ({
          name: s.name,
          instructions: s.instructions,
          timeLimitMinutes: s.timeLimitMinutes,
          questions: (s.questions || []).map((q) => ({
            questionId: q._id || q.id,
            marks: q.marks || 1,
          })),
        })),
      };

      const result = await createPaper(companyId, payload);
      setPaper(result.paper || result);
      return result.paper || result;
    } catch (err) {
      setError(err.message || 'Failed to save paper');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async (paperId) => {
    if (!companyId) return;
    try {
      setSaving(true);
      const result = await finalizePaper(companyId, paperId);
      setPaper(result.paper || result);
    } catch (err) {
      setError(err.message || 'Failed to finalize paper');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (pdfType) => {
    if (!companyId || !paper) return;
    try {
      const data = await downloadPdf(companyId, paper._id || paper.id, pdfType);
      if (data?.url) window.open(data.url, '_blank');
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
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
          <Button variant="ghost" size="sm" onClick={() => router.push(paths.dashboard.papers.root)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Papers
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create Paper</h1>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        <PaperBuilderWizard
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          onDownload={handleDownload}
          saving={saving}
          paper={paper}
        />
      </div>
    </div>
  );
}
