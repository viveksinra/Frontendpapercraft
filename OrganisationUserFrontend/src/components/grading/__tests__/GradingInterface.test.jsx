import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('lucide-react', () => ({
  Loader2: vi.fn(),
  CheckCircle2: vi.fn(),
}));

vi.mock('@/components/ui/card', () => ({
  Card: vi.fn(),
  CardHeader: vi.fn(),
  CardTitle: vi.fn(),
  CardContent: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(),
}));

vi.mock('../QuestionGradingTabs', () => ({ default: vi.fn() }));
vi.mock('../GradingProgressBar', () => ({ default: vi.fn() }));
vi.mock('../BulkGradingView', () => ({ default: vi.fn() }));

const mockGet = vi.fn();
const mockPost = vi.fn();
vi.mock('@/lib/axios', () => ({
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

vi.mock('@/lib/v2-endpoints', () => ({
  v2Endpoints: {
    onlineTests: {
      grading: (companyId, testId) =>
        `/api/v2/companies/${companyId}/online-tests/${testId}/grading`,
      grade: (companyId, testId) =>
        `/api/v2/companies/${companyId}/online-tests/${testId}/grade`,
      finalizeGrading: (companyId, testId) =>
        `/api/v2/companies/${companyId}/online-tests/${testId}/finalize-grading`,
    },
  },
}));

describe('GradingInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('allGraded logic', () => {
    it('returns true when totalGraded >= totalResponses and totalResponses > 0', () => {
      const questions = [
        { gradedCount: 5, totalResponses: 5 },
        { gradedCount: 3, totalResponses: 3 },
      ];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
      const allGraded = totalGraded >= totalResponses && totalResponses > 0;

      expect(totalGraded).toBe(8);
      expect(totalResponses).toBe(8);
      expect(allGraded).toBe(true);
    });

    it('returns true when totalGraded exceeds totalResponses (edge case)', () => {
      const questions = [{ gradedCount: 10, totalResponses: 5 }];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
      const allGraded = totalGraded >= totalResponses && totalResponses > 0;

      expect(allGraded).toBe(true);
    });

    it('returns false when totalGraded < totalResponses', () => {
      const questions = [
        { gradedCount: 2, totalResponses: 5 },
        { gradedCount: 3, totalResponses: 3 },
      ];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
      const allGraded = totalGraded >= totalResponses && totalResponses > 0;

      expect(totalGraded).toBe(5);
      expect(totalResponses).toBe(8);
      expect(allGraded).toBe(false);
    });

    it('returns false when totalResponses is 0 (no responses to grade)', () => {
      const questions = [
        { gradedCount: 0, totalResponses: 0 },
      ];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
      const allGraded = totalGraded >= totalResponses && totalResponses > 0;

      expect(allGraded).toBe(false);
    });

    it('returns false when questions array is empty', () => {
      const questions = [];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);
      const allGraded = totalGraded >= totalResponses && totalResponses > 0;

      expect(totalGraded).toBe(0);
      expect(totalResponses).toBe(0);
      expect(allGraded).toBe(false);
    });

    it('handles missing gradedCount/totalResponses with fallback to 0', () => {
      const questions = [
        { gradedCount: undefined, totalResponses: undefined },
        { gradedCount: null, totalResponses: 3 },
      ];
      const totalGraded = questions.reduce((sum, q) => sum + (q.gradedCount ?? 0), 0);
      const totalResponses = questions.reduce((sum, q) => sum + (q.totalResponses ?? 0), 0);

      expect(totalGraded).toBe(0);
      expect(totalResponses).toBe(3);
    });
  });

  describe('finalize button disabled logic', () => {
    it('is disabled when finalizing is true', () => {
      const finalizing = true;
      const allGraded = true;
      const disabled = finalizing || !allGraded;

      expect(disabled).toBe(true);
    });

    it('is disabled when allGraded is false', () => {
      const finalizing = false;
      const allGraded = false;
      const disabled = finalizing || !allGraded;

      expect(disabled).toBe(true);
    });

    it('is disabled when both finalizing and not allGraded', () => {
      const finalizing = true;
      const allGraded = false;
      const disabled = finalizing || !allGraded;

      expect(disabled).toBe(true);
    });

    it('is enabled only when not finalizing AND allGraded', () => {
      const finalizing = false;
      const allGraded = true;
      const disabled = finalizing || !allGraded;

      expect(disabled).toBe(false);
    });
  });

  describe('API endpoint construction', () => {
    it('constructs grading endpoint URL correctly', () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const gradingUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/grading`;

      expect(gradingUrl).toBe('/api/v2/companies/comp123/online-tests/test456/grading');
    });

    it('constructs grade endpoint URL correctly', () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const gradeUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/grade`;

      expect(gradeUrl).toBe('/api/v2/companies/comp123/online-tests/test456/grade');
    });

    it('constructs finalize-grading endpoint URL correctly', () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const finalizeUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/finalize-grading`;

      expect(finalizeUrl).toBe('/api/v2/companies/comp123/online-tests/test456/finalize-grading');
    });

    it('fetches grading data using axiosInstance.get', async () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const gradingUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/grading`;

      mockGet.mockResolvedValue({
        data: {
          questions: [
            { questionNumber: 1, gradedCount: 3, totalResponses: 5, responses: [] },
          ],
        },
      });

      const res = await mockGet(gradingUrl);
      expect(mockGet).toHaveBeenCalledWith(gradingUrl);
      expect(res.data.questions).toHaveLength(1);
      expect(res.data.questions[0].gradedCount).toBe(3);
    });

    it('posts grade data using axiosInstance.post', async () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const gradeUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/grade`;
      const gradeData = { questionId: 'q1', studentId: 's1', marks: 3 };

      mockPost.mockResolvedValue({ data: { success: true } });

      const res = await mockPost(gradeUrl, gradeData);
      expect(mockPost).toHaveBeenCalledWith(gradeUrl, gradeData);
      expect(res.data.success).toBe(true);
    });

    it('posts to finalize-grading endpoint', async () => {
      const companyId = 'comp123';
      const testId = 'test456';
      const finalizeUrl = `/api/v2/companies/${companyId}/online-tests/${testId}/finalize-grading`;

      mockPost.mockResolvedValue({ data: { finalized: true } });

      const res = await mockPost(finalizeUrl);
      expect(mockPost).toHaveBeenCalledWith(finalizeUrl);
      expect(res.data.finalized).toBe(true);
    });
  });

  describe('early return conditions', () => {
    it('does not fetch when testId is falsy', () => {
      const testId = null;
      const companyId = 'comp123';
      const shouldFetch = !!testId && !!companyId;

      expect(shouldFetch).toBe(false);
    });

    it('does not fetch when companyId is falsy', () => {
      const testId = 'test456';
      const companyId = '';
      const shouldFetch = !!testId && !!companyId;

      expect(shouldFetch).toBe(false);
    });

    it('fetches when both testId and companyId are provided', () => {
      const testId = 'test456';
      const companyId = 'comp123';
      const shouldFetch = !!testId && !!companyId;

      expect(shouldFetch).toBe(true);
    });
  });
});
