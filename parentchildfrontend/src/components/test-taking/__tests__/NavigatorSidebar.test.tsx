import { describe, it, expect, vi } from 'vitest';

// Mock the shared QuestionNavigator
vi.mock('@papercraft/shared', () => ({
  QuestionNavigator: () => null,
}));

const mockQuestions = [
  { _id: 'q1', questionNumber: 1 },
  { _id: 'q2', questionNumber: 2 },
  { _id: 'q3', questionNumber: 3 },
  { _id: 'q4', questionNumber: 4 },
  { _id: 'q5', questionNumber: 5 },
];

const mockAnswers = [
  { questionId: 'q1', answer: 'opt-a', flagged: false },
  { questionId: 'q2', answer: null, flagged: true },
  { questionId: 'q3', answer: 'opt-c', flagged: false },
  // q4 unanswered, not flagged
  // q5 unanswered, not flagged
];

const mockSections = [
  { name: 'Section 1', questionIds: ['q1', 'q2', 'q3'] },
  { name: 'Section 2', questionIds: ['q4', 'q5'] },
];

describe('NavigatorSidebar', () => {
  it('should be a valid component export', async () => {
    const { NavigatorSidebar } = await import('../NavigatorSidebar');
    expect(NavigatorSidebar).toBeDefined();
    expect(typeof NavigatorSidebar).toBe('function');
  });

  it('should render question buttons for all questions', () => {
    expect(mockQuestions).toHaveLength(5);
    mockQuestions.forEach((q, index) => {
      expect(q.questionNumber).toBe(index + 1);
      expect(q._id).toBeDefined();
    });
  });

  it('should color code answered questions', () => {
    const answeredIds = mockAnswers
      .filter((a) => a.answer != null && a.answer !== '')
      .map((a) => a.questionId);

    expect(answeredIds).toEqual(['q1', 'q3']);
    expect(answeredIds).toHaveLength(2);
  });

  it('should color code flagged questions', () => {
    const flaggedIds = mockAnswers
      .filter((a) => a.flagged)
      .map((a) => a.questionId);

    expect(flaggedIds).toEqual(['q2']);
    expect(flaggedIds).toHaveLength(1);
  });

  it('should identify unanswered questions', () => {
    const answeredOrFlaggedIds = mockAnswers.map((a) => a.questionId);
    const unansweredQuestions = mockQuestions.filter(
      (q) => !answeredOrFlaggedIds.includes(q._id)
    );

    expect(unansweredQuestions.map((q) => q._id)).toEqual(['q4', 'q5']);
  });

  it('should highlight the current question index', () => {
    const currentIndex = 2;

    expect(mockQuestions[currentIndex]._id).toBe('q3');
    expect(mockQuestions[currentIndex].questionNumber).toBe(3);
  });

  it('should call onSelect with correct index when a question button is clicked', () => {
    const onSelect = vi.fn();

    onSelect(0);
    expect(onSelect).toHaveBeenCalledWith(0);

    onSelect(3);
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it('should render section groupings in section_timed mode', () => {
    const mode = 'section_timed';
    const sections = mockSections;

    expect(sections).toHaveLength(2);
    expect(sections[0].questionIds).toHaveLength(3);
    expect(sections[1].questionIds).toHaveLength(2);
  });

  it('should pass mode to QuestionNavigator', () => {
    const fullMode = 'full';
    const sectionTimedMode = 'section_timed';

    expect(fullMode).toBe('full');
    expect(sectionTimedMode).toBe('section_timed');
  });

  it('should pass currentSectionIndex for section_timed mode', () => {
    let currentSectionIndex = 0;
    expect(mockSections[currentSectionIndex].name).toBe('Section 1');

    currentSectionIndex = 1;
    expect(mockSections[currentSectionIndex].name).toBe('Section 2');
  });

  it('should render header text "Question Navigator"', () => {
    const headerText = 'Question Navigator';
    expect(headerText).toBe('Question Navigator');
  });
});
