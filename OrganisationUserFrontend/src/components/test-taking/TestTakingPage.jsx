'use client';

import { TimerComponent, QuestionNavigator } from '@papercraft/shared';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Flag, Send, FlagOff, ChevronLeft, ChevronRight } from 'lucide-react';

import { startTest, submitTest as submitTestApi, submitAnswer as submitAnswerApi } from '@/lib/test-taking-api';

import { Button } from '@/components/ui/button';

import AnswerInput from './AnswerInput';
import QuestionDisplay from './QuestionDisplay';
import TestSubmitDialog from './TestSubmitDialog';
import AutoSaveIndicator from './AutoSaveIndicator';
import TestPreStartScreen from './TestPreStartScreen';
import SectionTransitionOverlay from './SectionTransitionOverlay';

// ─── Phases ─────────────────────────────────────────────────────────────────

const PHASE = {
  PRE_START: 'pre_start',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function TestTakingPage({ testId }) {
  // ── State ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState(PHASE.PRE_START);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const saveTimerRef = useRef(null);
  const submittingRef = useRef(false);

  // ── Fetch test data ─────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchTest() {
      try {
        setLoading(true);
        const data = await startTest(testId);
        setTest(data.test || data);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    }

    if (testId) {
      fetchTest();
    }
  }, [testId]);

  // ── Derived values ──────────────────────────────────────────────────────

  const isSectionTimed = test?.mode === 'section_timed';
  const totalSeconds = test?.scheduling?.duration ? test.scheduling.duration * 60 : 0;

  const currentQuestion = questions[currentIndex] || null;

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return answers.find((a) => a.questionId === currentQuestion._id) || null;
  }, [answers, currentQuestion]);

  const navigatorQuestions = useMemo(
    () =>
      questions.map((q, i) => ({
        _id: q._id,
        questionNumber: i + 1,
      })),
    [questions]
  );

  const navigatorSections = useMemo(() => {
    if (!test?.sections) return undefined;
    return test.sections.map((s) => ({
      name: s.name,
      questionIds: s.questionIds,
    }));
  }, [test]);

  const summary = useMemo(() => {
    let answered = 0;
    let unanswered = 0;
    let flagged = 0;

    for (const q of questions) {
      const a = answers.find((ans) => ans.questionId === q._id);
      if (a?.flagged) {
        flagged++;
      }
      if (
        a?.answer != null &&
        a.answer !== '' &&
        !(Array.isArray(a.answer) && a.answer.length === 0)
      ) {
        answered++;
      } else {
        unanswered++;
      }
    }

    return { total: questions.length, answered, unanswered, flagged };
  }, [questions, answers]);

  // ── Auto-save ─────────────────────────────────────────────────────────

  const performAutoSave = useCallback(
    async (answersToSave) => {
      try {
        setSaving(true);
        // Save each changed answer via the API
        const savePromises = Object.entries(answersToSave).map(([qId, ans]) =>
          submitAnswerApi(testId, qId, ans)
        );
        await Promise.allSettled(savePromises);
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setSaving(false);
      }
    },
    [testId]
  );

  const scheduleAutoSave = useCallback(
    (updatedAnswers) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        performAutoSave(updatedAnswers);
      }, 1500);
    },
    [performAutoSave]
  );

  // Cleanup on unmount
  useEffect(() => () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    }, []);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    // Initialise empty answers for all questions
    const initialAnswers = questions.map((q) => ({
      questionId: q._id,
      sectionIndex: 0,
      answer: null,
      flagged: false,
    }));
    setAnswers(initialAnswers);
    setCurrentIndex(0);
    setCurrentSectionIndex(0);
    setPhase(PHASE.IN_PROGRESS);
  }, [questions]);

  const handleAnswerChange = useCallback(
    (newValue) => {
      if (!currentQuestion) return;

      setAnswers((prev) => {
        const updated = prev.map((a) =>
          a.questionId === currentQuestion._id ? { ...a, answer: newValue } : a
        );
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [currentQuestion, scheduleAutoSave]
  );

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const updated = prev.map((a) =>
        a.questionId === currentQuestion._id ? { ...a, flagged: !a.flagged } : a
      );
      scheduleAutoSave(updated);
      return updated;
    });
  }, [currentQuestion, scheduleAutoSave]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  const handleNavigatorSelect = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleTimerExpiry = useCallback(() => {
    // Auto-submit when full test timer expires
    handleSubmit();
  }, [handleSubmit]);

  const handleSectionContinue = useCallback(
    (completedIndex) => {
      const nextSectionIndex = completedIndex + 1;
      setCurrentSectionIndex(nextSectionIndex);

      // Jump to first question of next section
      if (test?.sections?.[nextSectionIndex]) {
        const firstQId = test.sections[nextSectionIndex].questionIds[0];
        const qIdx = questions.findIndex((q) => q._id === firstQId);
        if (qIdx >= 0) {
          setCurrentIndex(qIdx);
        }
      }
    },
    [test, questions]
  );

  const handleSectionTimeUp = useCallback(() => {
    // Last section expired -- auto-submit
    handleSubmit();
  }, [handleSubmit]);

  const handleSubmit = useCallback(async () => {
    // Prevent double submission from timer expiry + manual submit race
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      setSaving(true);
      await submitTestApi(testId);
      setPhase(PHASE.SUBMITTED);
      setSubmitDialogOpen(false);
    } catch (err) {
      submittingRef.current = false;
      console.error('Submit failed:', err);
    } finally {
      setSaving(false);
    }
  }, [testId, answers]);

  // ── Render: Pre-start ─────────────────────────────────────────────────

  if (phase === PHASE.PRE_START) {
    return (
      <TestPreStartScreen
        test={test}
        onStart={handleStart}
        loading={loading}
      />
    );
  }

  // ── Render: Submitted ─────────────────────────────────────────────────

  if (phase === PHASE.SUBMITTED) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-green-600"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Test Submitted</h1>
        <p className="max-w-sm text-muted-foreground">
          Your answers have been submitted successfully. You will be able to view your
          results once they are published.
        </p>
      </div>
    );
  }

  // ── Render: In-progress test ──────────────────────────────────────────

  const isFlagged = currentAnswer?.flagged ?? false;

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header bar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">
            {test?.title}
          </h1>
          <AutoSaveIndicator saving={saving} />
        </div>

        <div className="flex items-center gap-3">
          {/* Timer: full-test or section-timed handled by overlay */}
          {!isSectionTimed && totalSeconds > 0 && (
            <TimerComponent
              totalSeconds={totalSeconds}
              onExpiry={handleTimerExpiry}
              mode="countdown"
            />
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setSubmitDialogOpen(true)}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Submit</span>
          </Button>
        </div>
      </header>

      {/* ── Body: two-column layout ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left: question + answer */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentIndex + 1}
            />

            <div className="border-t pt-4">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Your Answer
              </h3>
              <AnswerInput
                questionType={currentQuestion?.type}
                value={currentAnswer?.answer}
                onChange={handleAnswerChange}
                options={currentQuestion?.options}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant={isFlagged ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleToggleFlag}
              >
                {isFlagged ? (
                  <>
                    <FlagOff className="h-4 w-4" />
                    Unflag
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4" />
                    Flag
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex >= questions.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* Right: question navigator sidebar */}
        <aside className="w-full border-t bg-muted/20 p-4 lg:w-72 lg:border-l lg:border-t-0">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Questions
          </h3>
          <QuestionNavigator
            questions={navigatorQuestions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={handleNavigatorSelect}
            mode={isSectionTimed ? 'section_timed' : 'full'}
            sections={navigatorSections}
            currentSectionIndex={currentSectionIndex}
          />
        </aside>
      </div>

      {/* ── Section-timed overlay ────────────────────────────────────────── */}
      {isSectionTimed && test?.sections && (
        <SectionTransitionOverlay
          sections={test.sections}
          currentSectionIndex={currentSectionIndex}
          onContinue={handleSectionContinue}
          onTimeUp={handleSectionTimeUp}
        />
      )}

      {/* ── Submit dialog ────────────────────────────────────────────────── */}
      <TestSubmitDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        onSubmit={handleSubmit}
        summary={summary}
      />
    </div>
  );
}
