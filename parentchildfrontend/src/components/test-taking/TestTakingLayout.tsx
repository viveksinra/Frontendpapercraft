'use client';

import { useState } from 'react';
import { useTestTaking } from '@/hooks/useTestTaking';
import { TestHeader } from './TestHeader';
import { QuestionArea } from './QuestionArea';
import { NavigatorSidebar } from './NavigatorSidebar';
import { NavigatorBottomStrip } from './NavigatorBottomStrip';
import { SectionStopOverlay } from './SectionStopOverlay';
import { SubmitConfirmDialog } from './SubmitConfirmDialog';
import { PostTestResult } from './PostTestResult';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestTakingLayoutProps {
  testId: string;
}

export function TestTakingLayout({ testId }: TestTakingLayoutProps) {
  const test = useTestTaking(testId);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Loading state
  if (test.phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (test.phase === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{test.error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Submitted state
  if (test.phase === 'submitted' && test.result) {
    return <PostTestResult testId={testId} result={test.result as any} />;
  }

  // Submitting state
  if (test.phase === 'submitting') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Submitting your test...</p>
        </div>
      </div>
    );
  }

  const isSectionTimed = test.mode === 'section_timed' && test.sections.length > 0;
  const currentSection = test.sections[test.currentSectionIndex];
  const currentIsFlagged = test.currentAnswer?.flagged || false;

  // Prepare navigator data
  const navQuestions = test.questions.map((q) => ({
    _id: q._id,
    questionNumber: q.questionNumber,
  }));

  const navAnswers = test.answers.map((a) => ({
    questionId: a.questionId,
    answer: a.answer,
    flagged: a.flagged,
  }));

  const navSections = test.sections.map((s) => ({
    name: s.name,
    questionIds: s.questionIds,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <TestHeader
        testTitle={test.testTitle}
        sectionName={currentSection?.name}
        totalSeconds={test.totalSeconds}
        timerMode={isSectionTimed ? 'display_only' : 'countdown'}
        onTimeUp={test.handleTimeUp}
        onFlag={() => test.currentQuestion && test.toggleFlag(test.currentQuestion._id)}
        onSubmit={() => setShowSubmitDialog(true)}
        isFlagged={currentIsFlagged}
        autoSaveStatus={test.autoSaveStatus}
      />

      <div className="flex flex-1">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
          {test.currentQuestion && (
            <QuestionArea
              question={test.currentQuestion}
              answer={test.currentAnswer?.answer ?? null}
              onAnswer={(val) => test.setAnswer(test.currentQuestion!._id, val)}
            />
          )}
        </main>

        {/* Desktop sidebar navigator */}
        <NavigatorSidebar
          questions={navQuestions}
          answers={navAnswers}
          currentIndex={test.currentIndex}
          onSelect={test.navigateTo}
          mode={isSectionTimed ? 'section_timed' : 'full'}
          sections={navSections}
          currentSectionIndex={test.currentSectionIndex}
        />
      </div>

      {/* Mobile bottom strip */}
      <NavigatorBottomStrip
        questions={navQuestions}
        answers={navAnswers}
        currentIndex={test.currentIndex}
        onSelect={test.navigateTo}
        onPrev={test.navigatePrev}
        onNext={test.navigateNext}
        mode={isSectionTimed ? 'section_timed' : 'full'}
        sections={navSections}
        currentSectionIndex={test.currentSectionIndex}
        total={test.questions.length}
      />

      {/* Section timed controller */}
      {isSectionTimed && (
        <SectionStopOverlay
          sections={test.sections.map((s) => ({
            name: s.name,
            timeLimit: s.timeLimit,
            questionIds: s.questionIds,
            instructions: s.instructions,
          }))}
          currentSectionIndex={test.currentSectionIndex}
          onSectionComplete={test.handleSectionComplete}
          onTimeUp={test.handleTimeUp}
        />
      )}

      {/* Submit confirmation dialog */}
      <SubmitConfirmDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={() => {
          setShowSubmitDialog(false);
          test.handleSubmit();
        }}
        summary={test.summary}
        submitting={test.phase === 'submitting'}
      />
    </div>
  );
}
