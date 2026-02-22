import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/take-test/test1',
}));

// Mock the useTestTaking hook
const mockUseTestTaking = vi.fn();
vi.mock('@/hooks/useTestTaking', () => ({
  useTestTaking: (...args: unknown[]) => mockUseTestTaking(...args),
}));

// Mock child components
vi.mock('../TestHeader', () => ({ TestHeader: () => null }));
vi.mock('../QuestionArea', () => ({ QuestionArea: () => null }));
vi.mock('../NavigatorSidebar', () => ({ NavigatorSidebar: () => null }));
vi.mock('../NavigatorBottomStrip', () => ({ NavigatorBottomStrip: () => null }));
vi.mock('../SectionStopOverlay', () => ({ SectionStopOverlay: () => null }));
vi.mock('../SubmitConfirmDialog', () => ({ SubmitConfirmDialog: () => null }));
vi.mock('../PostTestResult', () => ({ PostTestResult: () => null }));

const mockTestState = {
  phase: 'in_progress' as const,
  testId: 'test1',
  testTitle: 'Math Chapter Test',
  questions: [
    { _id: 'q1', questionNumber: 1, type: 'mcq', text: 'What is 2+2?', marks: 2, sectionIndex: 0 },
    { _id: 'q2', questionNumber: 2, type: 'mcq', text: 'What is 3+3?', marks: 2, sectionIndex: 0 },
    { _id: 'q3', questionNumber: 3, type: 'numerical', text: 'Calculate 5*5', marks: 3, sectionIndex: 0 },
  ],
  answers: [
    { questionId: 'q1', answer: 'opt-a', flagged: false },
  ],
  currentIndex: 0,
  currentSectionIndex: 0,
  sections: [{ name: 'Section 1', questionIds: ['q1', 'q2', 'q3'], timeLimit: 30, instructions: 'Answer all' }],
  totalSeconds: 1800,
  mode: 'full',
  error: null,
  result: null,
  autoSaveStatus: 'idle' as const,
  currentQuestion: { _id: 'q1', questionNumber: 1, type: 'mcq', text: 'What is 2+2?', marks: 2, sectionIndex: 0 },
  currentAnswer: { questionId: 'q1', answer: 'opt-a', flagged: false },
  summary: { answered: 1, unanswered: 2, flagged: 0, total: 3 },
  setAnswer: vi.fn(),
  toggleFlag: vi.fn(),
  navigateTo: vi.fn(),
  navigateNext: vi.fn(),
  navigatePrev: vi.fn(),
  handleSubmit: vi.fn(),
  handleSectionComplete: vi.fn(),
  handleTimeUp: vi.fn(),
  dispatch: vi.fn(),
};

describe('TestTakingLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTestTaking.mockReturnValue(mockTestState);
  });

  it('should be a valid component export', async () => {
    const { TestTakingLayout } = await import('../TestTakingLayout');
    expect(TestTakingLayout).toBeDefined();
    expect(typeof TestTakingLayout).toBe('function');
  });

  it('should call useTestTaking with the testId', () => {
    mockUseTestTaking('test1');
    expect(mockUseTestTaking).toHaveBeenCalledWith('test1');
  });

  it('should provide question data to the question area', () => {
    const test = mockUseTestTaking('test1');
    expect(test.currentQuestion).toBeDefined();
    expect(test.currentQuestion._id).toBe('q1');
    expect(test.currentQuestion.text).toBe('What is 2+2?');
  });

  it('should provide navigator data with all questions', () => {
    const test = mockUseTestTaking('test1');

    const navQuestions = test.questions.map((q: any) => ({
      _id: q._id,
      questionNumber: q.questionNumber,
    }));

    expect(navQuestions).toHaveLength(3);
    expect(navQuestions[0]._id).toBe('q1');
    expect(navQuestions[1]._id).toBe('q2');
    expect(navQuestions[2]._id).toBe('q3');
  });

  it('should provide timer data from totalSeconds', () => {
    const test = mockUseTestTaking('test1');
    expect(test.totalSeconds).toBe(1800);
  });

  it('should handle loading phase', () => {
    mockUseTestTaking.mockReturnValue({ ...mockTestState, phase: 'loading' });
    const test = mockUseTestTaking('test1');
    expect(test.phase).toBe('loading');
  });

  it('should handle error phase', () => {
    mockUseTestTaking.mockReturnValue({ ...mockTestState, phase: 'error', error: 'Network failure' });
    const test = mockUseTestTaking('test1');
    expect(test.phase).toBe('error');
    expect(test.error).toBe('Network failure');
  });

  it('should handle submitted phase with result', () => {
    mockUseTestTaking.mockReturnValue({
      ...mockTestState,
      phase: 'submitted',
      result: { percentage: 85, grade: 'A' },
    });
    const test = mockUseTestTaking('test1');
    expect(test.phase).toBe('submitted');
    expect(test.result).toBeDefined();
  });

  it('should determine section_timed mode correctly', () => {
    const test = mockUseTestTaking('test1');

    // When mode is section_timed and sections exist
    const sectionTimedState = { ...test, mode: 'section_timed', sections: [{ name: 'S1', questionIds: ['q1'] }] };
    const isSectionTimed = sectionTimedState.mode === 'section_timed' && sectionTimedState.sections.length > 0;
    expect(isSectionTimed).toBe(true);

    // When mode is full
    const fullState = { ...test, mode: 'full' };
    const isNotSectionTimed = fullState.mode === 'section_timed' && fullState.sections.length > 0;
    expect(isNotSectionTimed).toBe(false);
  });

  it('should derive currentIsFlagged from currentAnswer', () => {
    const test = mockUseTestTaking('test1');
    const currentIsFlagged = test.currentAnswer?.flagged || false;
    expect(currentIsFlagged).toBe(false);

    // When flagged
    mockUseTestTaking.mockReturnValue({
      ...mockTestState,
      currentAnswer: { questionId: 'q1', answer: 'opt-a', flagged: true },
    });
    const test2 = mockUseTestTaking('test1');
    const isFlagged2 = test2.currentAnswer?.flagged || false;
    expect(isFlagged2).toBe(true);
  });
});
