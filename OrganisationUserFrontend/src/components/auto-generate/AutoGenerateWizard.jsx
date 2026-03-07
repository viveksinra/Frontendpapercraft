'use client';

import { useState } from 'react';
import { RefreshCw, ChevronLeft, CheckCircle, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import DraftReviewPanel from './DraftReviewPanel';
import BlueprintSelector from './BlueprintSelector';
import QuestionSwapDialog from './QuestionSwapDialog';

export default function AutoGenerateWizard({
  onGenerate,
  onRegenerate,
  onFinalize,
  onSwap,
  onGetSwaps,
  generating,
}) {
  const [step, setStep] = useState(0); // 0 = select, 1 = review
  const [title, setTitle] = useState('');
  const [blueprintId, setBlueprintId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [paper, setPaper] = useState(null);

  // Swap dialog state
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapQuestion, setSwapQuestion] = useState(null);
  const [swapSectionIndex, setSwapSectionIndex] = useState(0);
  const [swapQuestionIndex, setSwapQuestionIndex] = useState(0);
  const [alternatives, setAlternatives] = useState([]);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  const handleGenerate = async () => {
    const result = await onGenerate?.({ title, blueprintId, templateId });
    if (result) {
      setPaper(result.paper || result);
      setStep(1);
    }
  };

  const handleRegenerate = async () => {
    const result = await onRegenerate?.({ title, blueprintId, templateId });
    if (result) {
      setPaper(result.paper || result);
    }
  };

  const handleSwapClick = async (sectionIndex, questionIndex, question) => {
    setSwapQuestion(question);
    setSwapSectionIndex(sectionIndex);
    setSwapQuestionIndex(questionIndex);
    setSwapOpen(true);
    setLoadingSwaps(true);
    try {
      const data = await onGetSwaps?.(paper._id || paper.id, sectionIndex, questionIndex);
      setAlternatives(data?.alternatives || data?.swaps || []);
    } catch {
      setAlternatives([]);
    } finally {
      setLoadingSwaps(false);
    }
  };

  const handleSwapConfirm = async (newQuestionId) => {
    const paperId = paper._id || paper.id;
    const result = await onSwap?.(paperId, {
      sectionIndex: swapSectionIndex,
      questionNumber: swapQuestionIndex + 1,
      newQuestionId,
    });
    if (result) {
      setPaper(result.paper || result);
    }
    setSwapOpen(false);
  };

  const canGenerate = !!title.trim() && !!blueprintId && !!templateId;

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`px-3 py-1.5 rounded-md text-sm ${step === 0 ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted'}`}
          onClick={() => setStep(0)}
        >
          1. Select Blueprint
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <button
          type="button"
          className={`px-3 py-1.5 rounded-md text-sm ${step === 1 ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted text-muted-foreground'}`}
          disabled={!paper}
        >
          2. Review Draft
        </button>
      </div>

      {step === 0 && (
        <>
          <BlueprintSelector
            title={title}
            onTitleChange={setTitle}
            selectedBlueprintId={blueprintId}
            onSelectBlueprint={setBlueprintId}
            selectedTemplateId={templateId}
            onSelectTemplate={setTemplateId}
          />
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
              {generating ? 'Generating...' : 'Generate Paper'}
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {step === 1 && paper && (
        <>
          <DraftReviewPanel paper={paper} onSwapClick={handleSwapClick} />

          <div className="flex gap-2 justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRegenerate} disabled={generating}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Regenerate
              </Button>
              <Button onClick={() => onFinalize?.(paper._id || paper.id)} disabled={generating}>
                <CheckCircle className="mr-1.5 h-4 w-4" />
                Finalize
              </Button>
            </div>
          </div>

          <QuestionSwapDialog
            open={swapOpen}
            onOpenChange={setSwapOpen}
            currentQuestion={swapQuestion}
            alternatives={alternatives}
            loading={loadingSwaps}
            onSwap={handleSwapConfirm}
          />
        </>
      )}
    </div>
  );
}
