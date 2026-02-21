'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  autoGeneratePaper,
  finalizePaper,
  swapQuestion,
  getSuggestedSwaps,
} from 'src/lib/paper-api';

import { Button } from '@/components/ui/button';

import AutoGenerateWizard from 'src/components/auto-generate/AutoGenerateWizard';

export default function AutoGeneratePage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (data) => {
    if (!companyId) return null;
    try {
      setGenerating(true);
      setError(null);
      const result = await autoGeneratePaper(companyId, data);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to generate paper');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleFinalize = async (paperId) => {
    if (!companyId) return;
    try {
      setGenerating(true);
      await finalizePaper(companyId, paperId);
      router.push(paths.dashboard.papers.detail(paperId));
    } catch (err) {
      setError(err.message || 'Failed to finalize paper');
    } finally {
      setGenerating(false);
    }
  };

  const handleSwap = async (paperId, data) => {
    if (!companyId) return null;
    try {
      const result = await swapQuestion(companyId, paperId, data);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to swap question');
      return null;
    }
  };

  const handleGetSwaps = async (paperId, sectionIndex, questionNumber) => {
    if (!companyId) return null;
    try {
      return await getSuggestedSwaps(companyId, paperId, sectionIndex, questionNumber);
    } catch {
      return null;
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
          <h1 className="text-2xl font-bold tracking-tight">Auto-Generate Paper</h1>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        <AutoGenerateWizard
          onGenerate={handleGenerate}
          onRegenerate={handleGenerate}
          onFinalize={handleFinalize}
          onSwap={handleSwap}
          onGetSwaps={handleGetSwaps}
          generating={generating}
        />
      </div>
    </div>
  );
}
