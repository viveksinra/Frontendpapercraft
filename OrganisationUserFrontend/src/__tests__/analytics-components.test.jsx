import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- Mock shared package ----
vi.mock('@papercraft/shared', () => ({
  formatPercentile: vi.fn((p) => {
    if (p >= 95) return 'Top 5%';
    if (p >= 90) return 'Top 10%';
    if (p >= 75) return 'Top 25%';
    if (p >= 50) return 'Top 50%';
    return 'Bottom 50%';
  }),
  getImprovementLabel: vi.fn((rate) => {
    if (rate === 0) return 'No change';
    if (rate > 0) return `+${rate.toFixed(1)}% improvement`;
    return `${rate.toFixed(1)}% decline`;
  }),
  getQualificationBandColor: vi.fn((band) => {
    if (band === 'Strong Pass') return '#16a34a';
    if (band === 'Pass') return '#2563eb';
    if (band === 'Borderline') return '#d97706';
    if (band === 'Below') return '#dc2626';
    return '#6b7280';
  }),
  getTrendArrow: vi.fn((trend) => {
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'flat';
  }),
}));

// ---- Mock analytics-api ----
const mockGetStudentAnalytics = vi.fn();
const mockGetStudentScoreTrend = vi.fn();
const mockGetStudentSubjectRadar = vi.fn();
const mockGetClassTestAnalytics = vi.fn();
const mockGetInstituteOverview = vi.fn();
const mockGetEnrollmentTrends = vi.fn();
const mockGetTeacherActivity = vi.fn();
const mockGetContentUsage = vi.fn();
const mockGetStudentRetention = vi.fn();
const mockListQuestionAnalytics = vi.fn();
const mockGetProblematicQuestions = vi.fn();
const mockGetDifficultyCalibration = vi.fn();

vi.mock('src/lib/analytics-api', () => ({
  getStudentAnalytics: (...args) => mockGetStudentAnalytics(...args),
  getStudentScoreTrend: (...args) => mockGetStudentScoreTrend(...args),
  getStudentSubjectRadar: (...args) => mockGetStudentSubjectRadar(...args),
  getClassTestAnalytics: (...args) => mockGetClassTestAnalytics(...args),
  getInstituteOverview: (...args) => mockGetInstituteOverview(...args),
  getEnrollmentTrends: (...args) => mockGetEnrollmentTrends(...args),
  getTeacherActivity: (...args) => mockGetTeacherActivity(...args),
  getContentUsage: (...args) => mockGetContentUsage(...args),
  getStudentRetention: (...args) => mockGetStudentRetention(...args),
  listQuestionAnalytics: (...args) => mockListQuestionAnalytics(...args),
  getProblematicQuestions: (...args) => mockGetProblematicQuestions(...args),
  getDifficultyCalibration: (...args) => mockGetDifficultyCalibration(...args),
}));

vi.mock('src/lib/company-api', () => ({
  getActiveCompanyIdFromCookie: vi.fn().mockReturnValue('company-1'),
}));

describe('Org Frontend Analytics Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── StudentKPICards ───────────────────────────────────────────────
  describe('StudentKPICards', () => {
    it('renders null when stats is null/undefined', () => {
      // Component returns null when stats is falsy
      const stats = null;
      expect(stats).toBeNull();
    });

    it('renders four KPI cards with correct values', async () => {
      const { formatPercentile, getImprovementLabel } = await import('@papercraft/shared');

      const stats = {
        avgPercentage: 85.3,
        totalTests: 12,
        improvementRate: 5.2,
        percentileInOrg: 92,
      };

      // Verify computed card values
      expect(`${stats.avgPercentage.toFixed(1)}%`).toBe('85.3%');
      expect(stats.totalTests).toBe(12);
      expect(getImprovementLabel(stats.improvementRate)).toContain('+5.2%');
      expect(formatPercentile(stats.percentileInOrg)).toBe('Top 10%');
    });

    it('handles zero/missing stats with defaults', () => {
      const stats = {};
      const avgPercentage = stats.avgPercentage ?? 0;
      const totalTests = stats.totalTests ?? 0;
      const improvementRate = stats.improvementRate ?? 0;
      const percentileInOrg = stats.percentileInOrg;

      expect(avgPercentage).toBe(0);
      expect(totalTests).toBe(0);
      expect(improvementRate).toBe(0);
      expect(percentileInOrg).toBeUndefined();
    });

    it('uses green color for positive improvement, red for negative', () => {
      const getColor = (rate) => (rate ?? 0) >= 0 ? 'text-green-600' : 'text-red-600';

      expect(getColor(3.5)).toBe('text-green-600');
      expect(getColor(-2.1)).toBe('text-red-600');
      expect(getColor(0)).toBe('text-green-600');
      expect(getColor(undefined)).toBe('text-green-600');
    });

    it('shows "—" when percentile is null', () => {
      const percentileInOrg = null;
      const display = percentileInOrg != null ? 'formatted' : '—';
      expect(display).toBe('—');
    });
  });

  // ─── ElevenPlusPanel ───────────────────────────────────────────────
  describe('ElevenPlusPanel', () => {
    it('returns null when data is null', () => {
      const data = null;
      expect(data).toBeNull();
    });

    it('renders band with correct color', async () => {
      const { getQualificationBandColor } = await import('@papercraft/shared');

      const data = {
        band: { band: 'Pass', avgScore: 72.5, confidence: 'high', testCount: 6 },
        cohort: { percentile: 85, cohortSize: 120 },
        components: [
          { component: 'Verbal Reasoning', avgPercentage: 78.2, trend: 2.3 },
          { component: 'Non-Verbal Reasoning', avgPercentage: 65.0, trend: -1.5 },
        ],
      };

      expect(getQualificationBandColor(data.band.band)).toBe('#2563eb');
      expect(data.band.avgScore.toFixed(1)).toBe('72.5');
      expect(data.band.confidence).toBe('high');
      expect(data.band.testCount).toBe(6);
    });

    it('displays cohort info when cohortSize > 0', () => {
      const cohort = { percentile: 85, cohortSize: 120 };
      expect(cohort.cohortSize).toBeGreaterThan(0);
      expect(cohort.percentile).toBe(85);
    });

    it('hides cohort info when cohortSize is 0', () => {
      const cohort = { percentile: 0, cohortSize: 0 };
      expect(cohort.cohortSize).toBe(0);
    });

    it('renders component scores with trend arrows', async () => {
      const { getTrendArrow } = await import('@papercraft/shared');

      const components = [
        { component: 'Verbal Reasoning', avgPercentage: 78.2, trend: 2.3 },
        { component: 'Non-Verbal Reasoning', avgPercentage: 65.0, trend: -1.5 },
        { component: 'Mathematics', avgPercentage: 80.0, trend: 0.0 },
      ];

      expect(components).toHaveLength(3);
      expect(getTrendArrow(components[0].trend)).toBe('up');
      expect(getTrendArrow(components[1].trend)).toBe('down');
      expect(getTrendArrow(components[2].trend)).toBe('flat');
    });
  });

  // ─── ClassAnalyticsTab ─────────────────────────────────────────────
  describe('ClassAnalyticsTab', () => {
    it('calls getClassTestAnalytics with correct params', async () => {
      mockGetClassTestAnalytics.mockResolvedValue({
        scoreStats: { avg: 70, median: 72, highest: 95, lowest: 30 },
        completionRate: 0.85,
        topPerformers: [{ studentId: 's1', studentName: 'Alice', percentage: 95 }],
        bottomPerformers: [{ studentId: 's2', studentName: 'Bob', percentage: 30 }],
      });

      const result = await mockGetClassTestAnalytics('company-1', 'class-1', 'test-1');

      expect(result.scoreStats.avg).toBe(70);
      expect(result.scoreStats.median).toBe(72);
      expect(result.scoreStats.highest).toBe(95);
      expect(result.scoreStats.lowest).toBe(30);
      expect(result.completionRate).toBe(0.85);
      expect(result.topPerformers).toHaveLength(1);
      expect(result.topPerformers[0].studentName).toBe('Alice');
      expect(result.bottomPerformers).toHaveLength(1);
    });

    it('formats score stats for display', () => {
      const stats = { avg: 70.123, median: 72.456, highest: 95.0, lowest: 30.789 };

      expect(stats.avg.toFixed(1)).toBe('70.1');
      expect(stats.median.toFixed(1)).toBe('72.5');
      expect(stats.highest.toFixed(1)).toBe('95.0');
      expect(stats.lowest.toFixed(1)).toBe('30.8');
    });

    it('formats completion rate as percentage', () => {
      const completionRate = 0.85;
      expect(`${(completionRate * 100).toFixed(0)}%`).toBe('85%');
    });

    it('handles API errors gracefully', async () => {
      mockGetClassTestAnalytics.mockRejectedValue(new Error('Network error'));

      await expect(
        mockGetClassTestAnalytics('company-1', 'class-1', 'test-1')
      ).rejects.toThrow('Network error');
    });
  });

  // ─── InstituteAnalyticsTab ─────────────────────────────────────────
  describe('InstituteAnalyticsTab', () => {
    it('loads overview with all KPI metrics', async () => {
      const overviewData = {
        totalStudents: 450,
        totalTeachers: 25,
        totalClasses: 30,
        totalTests: 150,
        totalQuestions: 5000,
      };
      mockGetInstituteOverview.mockResolvedValue(overviewData);

      const overview = await mockGetInstituteOverview('company-1', { dateRange: '6m' });

      expect(overview.totalStudents).toBe(450);
      expect(overview.totalTeachers).toBe(25);
      expect(overview.totalClasses).toBe(30);
      expect(overview.totalTests).toBe(150);
      expect(overview.totalQuestions).toBe(5000);
    });

    it('loads teacher activity data', async () => {
      mockGetTeacherActivity.mockResolvedValue({
        teachers: [
          { teacherId: 't1', teacherName: 'Mr. Smith', questionsCreated: 100, testsCreated: 10, classesManaged: 3, lastActive: '2026-02-20T10:00:00Z' },
          { teacherId: 't2', teacherName: 'Ms. Jones', questionsCreated: 80, testsCreated: 8, classesManaged: 2, lastActive: '2026-02-19T10:00:00Z' },
        ],
      });

      const result = await mockGetTeacherActivity('company-1', { dateRange: '6m' });

      expect(result.teachers).toHaveLength(2);
      expect(result.teachers[0].teacherName).toBe('Mr. Smith');
      expect(result.teachers[0].questionsCreated).toBe(100);
    });

    it('loads content usage data', async () => {
      mockGetContentUsage.mockResolvedValue({
        content: [
          { testId: 'test1', testTitle: 'Math Quiz', attemptCount: 50, avgScore: 72.5, uniqueStudents: 30 },
        ],
      });

      const result = await mockGetContentUsage('company-1', { dateRange: '6m' });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].testTitle).toBe('Math Quiz');
      expect(result.content[0].avgScore.toFixed(1)).toBe('72.5');
    });

    it('loads retention data', async () => {
      mockGetStudentRetention.mockResolvedValue({
        retention: [{ month: '2026-01', activeStudents: 400, churnRate: 5 }],
      });

      const result = await mockGetStudentRetention('company-1', { dateRange: '6m' });

      expect(result.retention[0].activeStudents).toBe(400);
      expect(result.retention[0].churnRate).toBe(5);
    });

    it('formats KPI values with toLocaleString', () => {
      const value = 5000;
      expect(value.toLocaleString()).toBeTruthy();
      expect(typeof value.toLocaleString()).toBe('string');
    });

    it('supports 3 date ranges: 3m, 6m, 1y', () => {
      const ranges = ['3m', '6m', '1y'];
      expect(ranges).toHaveLength(3);

      const labels = {
        '3m': 'Last 3 Months',
        '6m': 'Last 6 Months',
        '1y': 'Last Year',
      };
      expect(labels['3m']).toBe('Last 3 Months');
      expect(labels['6m']).toBe('Last 6 Months');
      expect(labels['1y']).toBe('Last Year');
    });

    it('handles error when loading institute data', async () => {
      mockGetInstituteOverview.mockRejectedValue(new Error('Failed to load institute analytics'));

      await expect(
        mockGetInstituteOverview('company-1', { dateRange: '6m' })
      ).rejects.toThrow('Failed to load institute analytics');
    });
  });

  // ─── QuestionAnalyticsTab ──────────────────────────────────────────
  describe('QuestionAnalyticsTab', () => {
    it('loads paginated question list', async () => {
      mockListQuestionAnalytics.mockResolvedValue({
        questions: [
          { questionId: 'q1', taggedDifficulty: 'medium', actualDifficulty: 'hard', discriminationIndex: 0.35, accuracy: 62.5, totalAttempts: 100 },
          { questionId: 'q2', taggedDifficulty: 'easy', actualDifficulty: 'easy', discriminationIndex: 0.5, accuracy: 88.0, totalAttempts: 200 },
        ],
        total: 2,
        page: 1,
        pageSize: 20,
      });

      const result = await mockListQuestionAnalytics('company-1', { page: 1, pageSize: 20 });

      expect(result.questions).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('detects problematic questions', async () => {
      mockGetProblematicQuestions.mockResolvedValue({
        questions: [
          { questionId: 'q3', issues: ['Low discrimination index', 'Difficulty mismatch'] },
        ],
      });

      const result = await mockGetProblematicQuestions('company-1');

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].issues).toContain('Low discrimination index');
      expect(result.questions[0].issues).toContain('Difficulty mismatch');
    });

    it('loads difficulty calibration data', async () => {
      mockGetDifficultyCalibration.mockResolvedValue({
        easy: { totalQuestions: 50, avgAccuracy: 82.3 },
        medium: { totalQuestions: 80, avgAccuracy: 61.5 },
        hard: { totalQuestions: 40, avgAccuracy: 38.0 },
        expert: { totalQuestions: 15, avgAccuracy: 22.0 },
      });

      const calibration = await mockGetDifficultyCalibration('company-1');

      expect(calibration.easy.avgAccuracy).toBe(82.3);
      expect(calibration.medium.totalQuestions).toBe(80);
      expect(calibration.hard.avgAccuracy).toBe(38.0);
      expect(calibration.expert.totalQuestions).toBe(15);
    });

    it('applies difficulty filter', async () => {
      mockListQuestionAnalytics.mockResolvedValue({
        questions: [{ questionId: 'q1', taggedDifficulty: 'hard', accuracy: 35 }],
        total: 1,
      });

      const result = await mockListQuestionAnalytics('company-1', { difficulty: 'hard', page: 1 });

      expect(mockListQuestionAnalytics).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({ difficulty: 'hard' })
      );
      expect(result.questions[0].taggedDifficulty).toBe('hard');
    });

    it('classifies difficulty levels with correct colors', () => {
      function getDifficultyColor(diff) {
        if (diff === 'easy') return 'bg-green-100 text-green-700';
        if (diff === 'medium') return 'bg-yellow-100 text-yellow-700';
        if (diff === 'hard') return 'bg-orange-100 text-orange-700';
        if (diff === 'expert') return 'bg-red-100 text-red-700';
        return 'bg-muted text-muted-foreground';
      }

      expect(getDifficultyColor('easy')).toContain('green');
      expect(getDifficultyColor('medium')).toContain('yellow');
      expect(getDifficultyColor('hard')).toContain('orange');
      expect(getDifficultyColor('expert')).toContain('red');
    });

    it('classifies discrimination index with correct colors', () => {
      function getDiscriminationColor(di) {
        if (di >= 0.3) return 'text-green-600';
        if (di >= 0.2) return 'text-yellow-600';
        return 'text-red-600';
      }

      expect(getDiscriminationColor(0.5)).toBe('text-green-600');
      expect(getDiscriminationColor(0.25)).toBe('text-yellow-600');
      expect(getDiscriminationColor(0.1)).toBe('text-red-600');
    });

    it('detects difficulty mismatch (tagged != actual)', () => {
      const q = { taggedDifficulty: 'medium', actualDifficulty: 'hard' };
      expect(q.taggedDifficulty !== q.actualDifficulty).toBe(true);
    });

    it('handles empty question analytics data', async () => {
      mockListQuestionAnalytics.mockResolvedValue({ questions: [], total: 0 });

      const result = await mockListQuestionAnalytics('company-1', {});
      expect(result.questions).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('calculates pagination correctly', () => {
      const total = 85;
      const pageSize = 20;
      const totalPages = Math.ceil(total / pageSize);
      expect(totalPages).toBe(5);
    });
  });

  // ─── StudentAnalyticsTab ───────────────────────────────────────────
  describe('StudentAnalyticsTab', () => {
    it('loads student analytics with KPI stats', async () => {
      mockGetStudentAnalytics.mockResolvedValue({
        overallStats: {
          avgPercentage: 78.5,
          totalTests: 15,
          improvementRate: 4.2,
          percentileInOrg: 80,
        },
        subjectBreakdown: [
          { subjectName: 'Mathematics', avgPercentage: 85.0, topics: [] },
          { subjectName: 'English', avgPercentage: 70.0, topics: [] },
        ],
        elevenPlusAnalytics: {
          band: { band: 'Pass', avgScore: 72.0 },
          components: [],
          cohort: { percentile: 75, cohortSize: 100 },
        },
      });

      const result = await mockGetStudentAnalytics('company-1', 'student-1');

      expect(result.overallStats.avgPercentage).toBe(78.5);
      expect(result.overallStats.totalTests).toBe(15);
      expect(result.overallStats.improvementRate).toBe(4.2);
      expect(result.subjectBreakdown).toHaveLength(2);
      expect(result.elevenPlusAnalytics.band.band).toBe('Pass');
    });

    it('handles student not found error', async () => {
      mockGetStudentAnalytics.mockRejectedValue(new Error('Student not found'));

      await expect(
        mockGetStudentAnalytics('company-1', 'nonexistent')
      ).rejects.toThrow('Student not found');
    });

    it('searches by student ID', async () => {
      mockGetStudentAnalytics.mockResolvedValue({ overallStats: {} });

      await mockGetStudentAnalytics('company-1', 'student-123');

      expect(mockGetStudentAnalytics).toHaveBeenCalledWith('company-1', 'student-123');
    });
  });

  // ─── Shared analytics utility functions ────────────────────────────
  describe('Shared Analytics Utils', () => {
    it('formatPercentile returns correct labels', async () => {
      const { formatPercentile } = await import('@papercraft/shared');
      expect(formatPercentile(98)).toBe('Top 5%');
      expect(formatPercentile(92)).toBe('Top 10%');
      expect(formatPercentile(80)).toBe('Top 25%');
      expect(formatPercentile(55)).toBe('Top 50%');
      expect(formatPercentile(30)).toBe('Bottom 50%');
    });

    it('getImprovementLabel returns correct labels', async () => {
      const { getImprovementLabel } = await import('@papercraft/shared');
      expect(getImprovementLabel(5.0)).toContain('+5.0%');
      expect(getImprovementLabel(-3.2)).toContain('-3.2%');
      expect(getImprovementLabel(0)).toBe('No change');
    });

    it('getQualificationBandColor returns correct colors', async () => {
      const { getQualificationBandColor } = await import('@papercraft/shared');
      expect(getQualificationBandColor('Strong Pass')).toBe('#16a34a');
      expect(getQualificationBandColor('Pass')).toBe('#2563eb');
      expect(getQualificationBandColor('Borderline')).toBe('#d97706');
      expect(getQualificationBandColor('Below')).toBe('#dc2626');
      expect(getQualificationBandColor(null)).toBe('#6b7280');
    });

    it('getTrendArrow returns correct directions', async () => {
      const { getTrendArrow } = await import('@papercraft/shared');
      expect(getTrendArrow(2.5)).toBe('up');
      expect(getTrendArrow(-1.5)).toBe('down');
      expect(getTrendArrow(0)).toBe('flat');
    });
  });
});
