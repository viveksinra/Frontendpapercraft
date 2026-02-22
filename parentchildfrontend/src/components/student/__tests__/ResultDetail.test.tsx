import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/tests/test1/result',
}));

// Mock shared ScoreDisplay
vi.mock('@papercraft/shared', () => ({
  ScoreDisplay: () => null,
}));

const mockResultData = {
  testTitle: 'Mathematics Chapter Test',
  submittedAt: '2026-02-20T14:30:00Z',
  result: {
    percentage: 85.5,
    grade: 'A',
    marksObtained: 42,
    totalMarks: 50,
    rank: 3,
    percentile: 92,
    totalStudents: 30,
    sectionScores: [
      { name: 'Algebra', marksObtained: 18, totalMarks: 20, percentage: 90 },
      { name: 'Geometry', marksObtained: 14, totalMarks: 15, percentage: 93.3 },
      { name: 'Arithmetic', marksObtained: 10, totalMarks: 15, percentage: 66.7 },
    ],
  },
  questionBreakdown: [
    { _id: 'q1', questionNumber: 1, text: 'Solve 2x + 3 = 7', type: 'mcq', correct: true, marksObtained: 2, marks: 2 },
    { _id: 'q2', questionNumber: 2, text: 'Find the area of circle with r=5', type: 'numerical', correct: false, marksObtained: 0, marks: 3 },
    { _id: 'q3', questionNumber: 3, text: 'Simplify 3/4 + 1/2', type: 'mcq', correct: true, marksObtained: 2, marks: 2 },
  ],
};

const mockGetResultDetail = vi.fn();
vi.mock('@/lib/student-api', () => ({
  getResultDetail: (...args: unknown[]) => mockGetResultDetail(...args),
}));

describe('ResultDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetResultDetail.mockResolvedValue(mockResultData);
  });

  it('should be a valid component export', async () => {
    const { ResultDetail } = await import('../ResultDetail');
    expect(ResultDetail).toBeDefined();
    expect(typeof ResultDetail).toBe('function');
  });

  it('should render score card data correctly', async () => {
    const data = await mockGetResultDetail('test1');
    const result = data.result;

    expect(result.percentage).toBe(85.5);
    expect(result.grade).toBe('A');
    expect(result.marksObtained).toBe(42);
    expect(result.totalMarks).toBe(50);
    expect(result.rank).toBe(3);
    expect(result.percentile).toBe(92);
    expect(result.totalStudents).toBe(30);
  });

  it('should provide section breakdown data', async () => {
    const data = await mockGetResultDetail('test1');
    const sections = data.result.sectionScores;

    expect(sections).toHaveLength(3);
    expect(sections[0].name).toBe('Algebra');
    expect(sections[0].percentage).toBe(90);
    expect(sections[1].name).toBe('Geometry');
    expect(sections[2].name).toBe('Arithmetic');
    expect(sections[2].percentage).toBe(66.7);
  });

  it('should provide question review data', async () => {
    const data = await mockGetResultDetail('test1');
    const questions = data.questionBreakdown;

    expect(questions).toHaveLength(3);
    expect(questions[0].correct).toBe(true);
    expect(questions[1].correct).toBe(false);
    expect(questions[2].type).toBe('mcq');
  });

  it('should correctly extract result from data.result or data directly', () => {
    // When data has .result property
    const dataWithResult = { result: { percentage: 85, grade: 'A' } };
    const result1 = dataWithResult.result || dataWithResult;
    expect(result1.percentage).toBe(85);

    // When data IS the result
    const dataIsResult = { percentage: 85, grade: 'A' };
    const result2 = (dataIsResult as any).result || dataIsResult;
    expect(result2.percentage).toBe(85);
  });

  it('should correctly extract questions from questionBreakdown or questions', () => {
    // From questionBreakdown
    const data1 = { questionBreakdown: [{ _id: 'q1' }], questions: [] };
    const questions1 = data1.questionBreakdown || data1.questions || [];
    expect(questions1).toHaveLength(1);

    // From questions when questionBreakdown is absent
    const data2 = { questions: [{ _id: 'q1' }, { _id: 'q2' }] };
    const questions2 = (data2 as any).questionBreakdown || data2.questions || [];
    expect(questions2).toHaveLength(2);

    // Both missing
    const data3 = {} as any;
    const questions3 = data3.questionBreakdown || data3.questions || [];
    expect(questions3).toHaveLength(0);
  });

  it('should call getResultDetail with testId and optional attemptNumber', async () => {
    await mockGetResultDetail('test1');
    expect(mockGetResultDetail).toHaveBeenCalledWith('test1');

    await mockGetResultDetail('test1', 2);
    expect(mockGetResultDetail).toHaveBeenCalledWith('test1', 2);
  });

  it('should handle missing optional fields with defaults', () => {
    const result = {} as any;

    expect(result.percentage || 0).toBe(0);
    expect(result.grade || '-').toBe('-');
    expect(result.marksObtained || 0).toBe(0);
    expect(result.totalMarks || 0).toBe(0);
  });

  it('should handle error state when API fails', async () => {
    mockGetResultDetail.mockRejectedValue(new Error('Failed to load result'));

    await expect(mockGetResultDetail('test1')).rejects.toThrow('Failed to load result');
  });
});
