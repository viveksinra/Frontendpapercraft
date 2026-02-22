'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  startTest,
  getAttemptState,
  submitAnswer,
  flagQuestion,
  submitTest,
  getResult,
  startSection,
} from '@/lib/test-taking-api';
import { useAutoSave } from './useAutoSave';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Question {
  _id: string;
  questionNumber: number;
  type: string;
  text: string;
  options?: { _id: string; text: string }[];
  marks: number;
  sectionIndex: number;
  passage?: string;
  columns?: { left: string[]; right: string[] };
  [key: string]: unknown;
}

export interface AnswerEntry {
  questionId: string;
  answer: unknown;
  flagged: boolean;
}

export type TestPhase = 'loading' | 'pre_test' | 'in_progress' | 'section_stop' | 'submitting' | 'submitted' | 'error';

interface TestState {
  phase: TestPhase;
  testId: string;
  testTitle: string;
  questions: Question[];
  answers: AnswerEntry[];
  currentIndex: number;
  currentSectionIndex: number;
  sections: { name: string; questionIds: string[]; timeLimit: number; instructions?: string }[];
  totalSeconds: number;
  mode: string;
  error: string | null;
  result: unknown | null;
  testInfo: Record<string, unknown>;
}

type TestAction =
  | { type: 'SET_STATE'; payload: Partial<TestState> }
  | { type: 'SET_ANSWER'; questionId: string; answer: unknown }
  | { type: 'TOGGLE_FLAG'; questionId: string }
  | { type: 'NAVIGATE'; index: number }
  | { type: 'SET_PHASE'; phase: TestPhase }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_RESULT'; result: unknown }
  | { type: 'NEXT_SECTION' };

function reducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'SET_ANSWER': {
      const existing = state.answers.find((a) => a.questionId === action.questionId);
      if (existing) {
        return {
          ...state,
          answers: state.answers.map((a) =>
            a.questionId === action.questionId ? { ...a, answer: action.answer } : a
          ),
        };
      }
      return {
        ...state,
        answers: [...state.answers, { questionId: action.questionId, answer: action.answer, flagged: false }],
      };
    }

    case 'TOGGLE_FLAG': {
      const existing = state.answers.find((a) => a.questionId === action.questionId);
      if (existing) {
        return {
          ...state,
          answers: state.answers.map((a) =>
            a.questionId === action.questionId ? { ...a, flagged: !a.flagged } : a
          ),
        };
      }
      return {
        ...state,
        answers: [...state.answers, { questionId: action.questionId, answer: null, flagged: true }],
      };
    }

    case 'NAVIGATE':
      return { ...state, currentIndex: action.index };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SET_ERROR':
      return { ...state, phase: 'error', error: action.error };

    case 'SET_RESULT':
      return { ...state, phase: 'submitted', result: action.result };

    case 'NEXT_SECTION': {
      const nextSection = state.currentSectionIndex + 1;
      // Find the first question index in the next section
      const nextSectionQuestionIds = state.sections[nextSection]?.questionIds || [];
      const nextIndex = state.questions.findIndex((q) => nextSectionQuestionIds.includes(q._id));
      return {
        ...state,
        currentSectionIndex: nextSection,
        currentIndex: nextIndex >= 0 ? nextIndex : state.currentIndex,
        phase: 'in_progress',
      };
    }

    default:
      return state;
  }
}

const initialState: TestState = {
  phase: 'loading',
  testId: '',
  testTitle: '',
  questions: [],
  answers: [],
  currentIndex: 0,
  currentSectionIndex: 0,
  sections: [],
  totalSeconds: 0,
  mode: '',
  error: null,
  result: null,
  testInfo: {},
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useTestTaking(testId: string) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, testId });
  const initialized = useRef(false);

  // Auto-save handler
  const handleAutoSave = useCallback(
    async (data: unknown) => {
      const { questionId, answer } = data as { questionId: string; answer: unknown };
      await submitAnswer(testId, questionId, answer);
    },
    [testId]
  );

  const { status: autoSaveStatus, trigger: triggerAutoSave } = useAutoSave({
    onSave: handleAutoSave,
    delay: 1200,
  });

  // Load attempt state
  const loadState = useCallback(async () => {
    try {
      const data = await getAttemptState(testId);
      dispatch({
        type: 'SET_STATE',
        payload: {
          phase: 'in_progress',
          testTitle: data.test?.title || '',
          questions: data.questions || [],
          answers: (data.answers || []).map((a: AnswerEntry) => ({
            questionId: a.questionId,
            answer: a.answer,
            flagged: a.flagged || false,
          })),
          currentIndex: data.currentIndex || 0,
          currentSectionIndex: data.currentSectionIndex || 0,
          sections: data.sections || [],
          totalSeconds: data.remainingSeconds || data.totalSeconds || 0,
          mode: data.test?.mode || data.mode || '',
          testInfo: data.test || {},
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load test state';
      dispatch({ type: 'SET_ERROR', error: message });
    }
  }, [testId]);

  // Initialize
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        await startTest(testId);
        await loadState();
      } catch {
        // If start fails, try to resume existing attempt
        try {
          await loadState();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to start test';
          dispatch({ type: 'SET_ERROR', error: message });
        }
      }
    }

    init();
  }, [testId, loadState]);

  // Actions
  const setAnswer = useCallback(
    (questionId: string, answer: unknown) => {
      dispatch({ type: 'SET_ANSWER', questionId, answer });
      triggerAutoSave({ questionId, answer });
    },
    [triggerAutoSave]
  );

  const toggleFlag = useCallback(
    async (questionId: string) => {
      dispatch({ type: 'TOGGLE_FLAG', questionId });
      try {
        await flagQuestion(testId, questionId);
      } catch {
        // Silently fail - flag state is local
      }
    },
    [testId]
  );

  const navigateTo = useCallback((index: number) => {
    dispatch({ type: 'NAVIGATE', index });
  }, []);

  const navigateNext = useCallback(() => {
    dispatch({ type: 'NAVIGATE', index: Math.min(state.currentIndex + 1, state.questions.length - 1) });
  }, [state.currentIndex, state.questions.length]);

  const navigatePrev = useCallback(() => {
    dispatch({ type: 'NAVIGATE', index: Math.max(state.currentIndex - 1, 0) });
  }, [state.currentIndex]);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'SET_PHASE', phase: 'submitting' });
    try {
      await submitTest(testId);
      const result = await getResult(testId);
      dispatch({ type: 'SET_RESULT', result });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit test';
      dispatch({ type: 'SET_ERROR', error: message });
    }
  }, [testId]);

  const handleSectionComplete = useCallback(
    async (completedIndex: number) => {
      try {
        await startSection(testId, completedIndex + 1);
        dispatch({ type: 'NEXT_SECTION' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to start next section';
        dispatch({ type: 'SET_ERROR', error: message });
      }
    },
    [testId]
  );

  const handleTimeUp = useCallback(async () => {
    await handleSubmit();
  }, [handleSubmit]);

  // Derived
  const currentQuestion = state.questions[state.currentIndex] || null;
  const currentAnswer = state.answers.find((a) => a.questionId === currentQuestion?._id);

  const summary = useMemo(() => {
    const answered = state.answers.filter(
      (a) => a.answer != null && a.answer !== '' && !(Array.isArray(a.answer) && a.answer.length === 0)
    ).length;
    const flagged = state.answers.filter((a) => a.flagged).length;
    const unanswered = state.questions.length - answered;
    return { answered, flagged, unanswered, total: state.questions.length };
  }, [state.answers, state.questions]);

  return {
    ...state,
    autoSaveStatus,
    currentQuestion,
    currentAnswer,
    summary,
    setAnswer,
    toggleFlag,
    navigateTo,
    navigateNext,
    navigatePrev,
    handleSubmit,
    handleSectionComplete,
    handleTimeUp,
    dispatch,
  };
}
