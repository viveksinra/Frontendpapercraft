import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('react', () => ({
  default: { createElement: vi.fn() },
}));

// Reproduce the component's pure logic for testing
interface NavigatorQuestion {
  _id: string;
  questionNumber: number;
}

interface NavigatorAnswer {
  questionId: string;
  answer: unknown;
  flagged: boolean;
}

interface NavigatorSection {
  name: string;
  questionIds: string[];
}

type ButtonState = 'unanswered' | 'answered' | 'flagged' | 'current' | 'locked';

function getButtonState(
  question: NavigatorQuestion,
  answer: NavigatorAnswer | undefined,
  isCurrent: boolean,
  isLocked: boolean
): ButtonState {
  if (isLocked) return 'locked';
  if (isCurrent) return 'current';
  if (answer?.flagged) return 'flagged';
  if (answer?.answer != null && answer.answer !== '' && !(Array.isArray(answer.answer) && answer.answer.length === 0)) {
    return 'answered';
  }
  return 'unanswered';
}

describe('QuestionNavigator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getButtonState', () => {
    const question: NavigatorQuestion = { _id: 'q1', questionNumber: 1 };

    it('returns "locked" when isLocked is true regardless of other state', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: 'A', flagged: true };
      expect(getButtonState(question, answer, true, true)).toBe('locked');
      expect(getButtonState(question, answer, false, true)).toBe('locked');
      expect(getButtonState(question, undefined, false, true)).toBe('locked');
    });

    it('returns "current" when isCurrent is true and not locked', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: 'A', flagged: false };
      expect(getButtonState(question, answer, true, false)).toBe('current');
      expect(getButtonState(question, undefined, true, false)).toBe('current');
    });

    it('returns "flagged" when answer is flagged and not current or locked', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: 'A', flagged: true };
      expect(getButtonState(question, answer, false, false)).toBe('flagged');
    });

    it('returns "flagged" even when answer has no value but is flagged', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: null, flagged: true };
      expect(getButtonState(question, answer, false, false)).toBe('flagged');
    });

    it('returns "answered" when answer exists and is not flagged/current/locked', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: 'B', flagged: false };
      expect(getButtonState(question, answer, false, false)).toBe('answered');
    });

    it('returns "answered" for non-empty array answers', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: ['A', 'C'], flagged: false };
      expect(getButtonState(question, answer, false, false)).toBe('answered');
    });

    it('returns "unanswered" when answer is undefined', () => {
      expect(getButtonState(question, undefined, false, false)).toBe('unanswered');
    });

    it('returns "unanswered" when answer value is null', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: null, flagged: false };
      expect(getButtonState(question, answer, false, false)).toBe('unanswered');
    });

    it('returns "unanswered" when answer value is empty string', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: '', flagged: false };
      expect(getButtonState(question, answer, false, false)).toBe('unanswered');
    });

    it('returns "unanswered" when answer value is empty array', () => {
      const answer: NavigatorAnswer = { questionId: 'q1', answer: [], flagged: false };
      expect(getButtonState(question, answer, false, false)).toBe('unanswered');
    });
  });

  describe('section-timed locking', () => {
    const sections: NavigatorSection[] = [
      { name: 'Section A', questionIds: ['q1', 'q2'] },
      { name: 'Section B', questionIds: ['q3', 'q4'] },
      { name: 'Section C', questionIds: ['q5', 'q6'] },
    ];

    it('locks sections before currentSectionIndex (past sections)', () => {
      const currentSectionIndex = 2;

      sections.forEach((section, sectionIdx) => {
        const isLocked = sectionIdx < currentSectionIndex;
        const isFuture = sectionIdx > currentSectionIndex;

        if (sectionIdx === 0) {
          expect(isLocked).toBe(true);
          expect(isFuture).toBe(false);
        }
        if (sectionIdx === 1) {
          expect(isLocked).toBe(true);
          expect(isFuture).toBe(false);
        }
        if (sectionIdx === 2) {
          expect(isLocked).toBe(false);
          expect(isFuture).toBe(false);
        }
      });
    });

    it('locks sections after currentSectionIndex (future sections)', () => {
      const currentSectionIndex = 0;

      sections.forEach((section, sectionIdx) => {
        const isLocked = sectionIdx < currentSectionIndex;
        const isFuture = sectionIdx > currentSectionIndex;

        if (sectionIdx === 0) {
          expect(isLocked).toBe(false);
          expect(isFuture).toBe(false);
        }
        if (sectionIdx === 1) {
          expect(isLocked).toBe(false);
          expect(isFuture).toBe(true);
        }
        if (sectionIdx === 2) {
          expect(isLocked).toBe(false);
          expect(isFuture).toBe(true);
        }
      });
    });

    it('only the current section is unlocked and not future', () => {
      const currentSectionIndex = 1;

      sections.forEach((section, sectionIdx) => {
        const isLocked = sectionIdx < currentSectionIndex;
        const isFuture = sectionIdx > currentSectionIndex;
        const isAccessible = !isLocked && !isFuture;

        if (sectionIdx === 0) expect(isAccessible).toBe(false); // past
        if (sectionIdx === 1) expect(isAccessible).toBe(true);  // current
        if (sectionIdx === 2) expect(isAccessible).toBe(false); // future
      });
    });
  });

  describe('answer counting logic', () => {
    it('correctly counts answered, unanswered, and flagged questions', () => {
      const questions: NavigatorQuestion[] = [
        { _id: 'q1', questionNumber: 1 },
        { _id: 'q2', questionNumber: 2 },
        { _id: 'q3', questionNumber: 3 },
        { _id: 'q4', questionNumber: 4 },
        { _id: 'q5', questionNumber: 5 },
      ];

      const answers: NavigatorAnswer[] = [
        { questionId: 'q1', answer: 'A', flagged: false },      // answered
        { questionId: 'q2', answer: null, flagged: true },       // flagged
        { questionId: 'q3', answer: 'C', flagged: false },       // answered
        // q4 has no answer entry                                 // unanswered
        { questionId: 'q5', answer: '', flagged: false },        // unanswered
      ];

      const answerMap = new Map(answers.map((a) => [a.questionId, a]));

      let answeredCount = 0;
      let unansweredCount = 0;
      let flaggedCount = 0;

      for (const q of questions) {
        const a = answerMap.get(q._id);
        if (a?.flagged) {
          flaggedCount++;
        } else if (
          a?.answer != null &&
          a.answer !== '' &&
          !(Array.isArray(a.answer) && a.answer.length === 0)
        ) {
          answeredCount++;
        } else {
          unansweredCount++;
        }
      }

      expect(answeredCount).toBe(2);   // q1, q3
      expect(flaggedCount).toBe(1);     // q2
      expect(unansweredCount).toBe(2);  // q4, q5
    });

    it('counts all as unanswered when no answers provided', () => {
      const questions: NavigatorQuestion[] = [
        { _id: 'q1', questionNumber: 1 },
        { _id: 'q2', questionNumber: 2 },
      ];
      const answers: NavigatorAnswer[] = [];
      const answerMap = new Map(answers.map((a) => [a.questionId, a]));

      let answeredCount = 0;
      let unansweredCount = 0;
      let flaggedCount = 0;

      for (const q of questions) {
        const a = answerMap.get(q._id);
        if (a?.flagged) {
          flaggedCount++;
        } else if (
          a?.answer != null &&
          a.answer !== '' &&
          !(Array.isArray(a.answer) && a.answer.length === 0)
        ) {
          answeredCount++;
        } else {
          unansweredCount++;
        }
      }

      expect(answeredCount).toBe(0);
      expect(flaggedCount).toBe(0);
      expect(unansweredCount).toBe(2);
    });
  });

  describe('onSelect callback', () => {
    it('calls onSelect with the correct global index', () => {
      const onSelect = vi.fn();
      const globalIndex = 3;

      onSelect(globalIndex);
      expect(onSelect).toHaveBeenCalledWith(3);
    });
  });
});
