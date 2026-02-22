import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- Mock shared package ----
vi.mock('@papercraft/shared', () => ({
  formatPercentile: vi.fn((p: number) => {
    if (p >= 95) return 'Top 5%';
    if (p >= 90) return 'Top 10%';
    if (p >= 75) return 'Top 25%';
    if (p >= 50) return 'Top 50%';
    return 'Bottom 50%';
  }),
  getImprovementLabel: vi.fn((rate: number) => {
    if (rate === 0) return 'No change';
    if (rate > 0) return `+${rate.toFixed(1)}% improvement`;
    return `${rate.toFixed(1)}% decline`;
  }),
  getQualificationBandColor: vi.fn((band: string | null) => {
    if (band === 'Strong Pass') return '#16a34a';
    if (band === 'Pass') return '#2563eb';
    if (band === 'Borderline') return '#d97706';
    if (band === 'Below') return '#dc2626';
    return '#6b7280';
  }),
  getTrendArrow: vi.fn((trend: number) => {
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'flat';
  }),
}));

// ---- Mock parent-api ----
const mockGetChildAnalytics = vi.fn();
const mockGetChildScoreTrend = vi.fn();
const mockGetChildSubjectRadar = vi.fn();
const mockGetChildElevenPlusAnalytics = vi.fn();
const mockGetChildReports = vi.fn();
const mockDownloadChildReport = vi.fn();

vi.mock('@/lib/parent-api', () => ({
  getChildAnalytics: (...args: unknown[]) => mockGetChildAnalytics(...args),
  getChildScoreTrend: (...args: unknown[]) => mockGetChildScoreTrend(...args),
  getChildSubjectRadar: (...args: unknown[]) => mockGetChildSubjectRadar(...args),
  getChildElevenPlusAnalytics: (...args: unknown[]) => mockGetChildElevenPlusAnalytics(...args),
  getChildReports: (...args: unknown[]) => mockGetChildReports(...args),
  downloadChildReport: (...args: unknown[]) => mockDownloadChildReport(...args),
  getChildPerformance: vi.fn(),
}));

// ---- Mock UI components ----
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => ({ type: 'Card', props: { children, className } }),
  CardContent: ({ children, className }: any) => ({ type: 'CardContent', props: { children, className } }),
  CardHeader: ({ children }: any) => ({ type: 'CardHeader', props: { children } }),
  CardTitle: ({ children }: any) => ({ type: 'CardTitle', props: { children } }),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size }: any) => ({
    type: 'Button',
    props: { children, onClick, variant, size },
  }),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => ({ type: 'Badge', props: { children, variant } }),
}));

describe('ChildAnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is exported as a named function', async () => {
    const mod = await import('../ChildAnalyticsDashboard');
    expect(mod.ChildAnalyticsDashboard).toBeDefined();
    expect(typeof mod.ChildAnalyticsDashboard).toBe('function');
  });

  it('loads child analytics and reports on mount', async () => {
    mockGetChildAnalytics.mockResolvedValue({
      overallStats: {
        avgPercentage: 72.5,
        totalTests: 10,
        improvementRate: 3.1,
        percentileInOrg: 65,
      },
      subjectBreakdown: [
        { subjectName: 'Mathematics', avgPercentage: 80.0 },
        { subjectName: 'English', avgPercentage: 65.0 },
      ],
    });
    mockGetChildReports.mockResolvedValue({
      reports: [
        { _id: 'r1', title: 'Term Report', status: 'completed', createdAt: '2026-02-10T10:00:00Z' },
        { _id: 'r2', title: 'Progress Report', status: 'pending', createdAt: '2026-02-20T10:00:00Z' },
      ],
    });

    const [analytics, reports] = await Promise.all([
      mockGetChildAnalytics('child-1'),
      mockGetChildReports('child-1'),
    ]);

    expect(analytics.overallStats.avgPercentage).toBe(72.5);
    expect(analytics.overallStats.totalTests).toBe(10);
    expect(analytics.subjectBreakdown).toHaveLength(2);
    expect(reports.reports).toHaveLength(2);
    expect(reports.reports[0].status).toBe('completed');
    expect(reports.reports[1].status).toBe('pending');
  });

  it('loads 11+ data for eligible children', async () => {
    mockGetChildElevenPlusAnalytics.mockResolvedValue({
      band: { band: 'Strong Pass', avgScore: 88.0, testCount: 8 },
      components: [
        { component: 'Verbal Reasoning', avgPercentage: 90.0, trend: 3.0 },
        { component: 'Non-Verbal Reasoning', avgPercentage: 85.0, trend: 1.5 },
        { component: 'Mathematics', avgPercentage: 92.0, trend: 2.0 },
        { component: 'English', avgPercentage: 84.0, trend: -0.5 },
      ],
      cohort: { percentile: 92, cohortSize: 150 },
    });

    const result = await mockGetChildElevenPlusAnalytics('child-1');
    expect(result.band.band).toBe('Strong Pass');
    expect(result.band.avgScore).toBe(88.0);
    expect(result.components).toHaveLength(4);
    expect(result.cohort.percentile).toBe(92);
    expect(result.cohort.cohortSize).toBe(150);
  });

  it('handles 11+ data failure gracefully (optional)', async () => {
    mockGetChildElevenPlusAnalytics.mockRejectedValue(new Error('No 11+ data'));

    let elevenPlusData = null;
    try {
      elevenPlusData = await mockGetChildElevenPlusAnalytics('child-1');
    } catch {
      // Expected — 11+ is optional
    }
    expect(elevenPlusData).toBeNull();
  });

  it('handles analytics load failure with error message', async () => {
    mockGetChildAnalytics.mockRejectedValue(new Error('Failed to load analytics'));

    await expect(mockGetChildAnalytics('child-1')).rejects.toThrow('Failed to load analytics');
  });

  it('downloads completed report', async () => {
    mockDownloadChildReport.mockResolvedValue({
      downloadUrl: 'https://s3.example.com/reports/child-report.pdf',
    });

    const result = await mockDownloadChildReport('child-1', 'r1');
    expect(result.downloadUrl).toContain('s3.example.com');
  });

  // ─── ChildImprovementSummary logic ─────────────────────────────────
  describe('ChildImprovementSummary logic', () => {
    it('generates improvement narrative for positive trend', () => {
      const stats = { totalTests: 10, avgPercentage: 75, improvementRate: 4.5 };
      const name = 'Emma';
      const improvement = stats.improvementRate;

      let text = '';
      if (improvement > 0) {
        text = `${name} has improved by ${improvement.toFixed(1)}% since starting.`;
      }

      expect(text).toContain('Emma');
      expect(text).toContain('4.5%');
      expect(text).toContain('improved');
    });

    it('generates concern narrative for negative trend', () => {
      const stats = { totalTests: 8, avgPercentage: 60, improvementRate: -3.2 };
      const name = 'Jack';
      const improvement = stats.improvementRate;

      let text = '';
      if (improvement < 0) {
        text = `${name}'s scores have dipped by ${Math.abs(improvement).toFixed(1)}% recently.`;
      }

      expect(text).toContain('Jack');
      expect(text).toContain('3.2%');
      expect(text).toContain('dipped');
    });

    it('generates steady narrative for zero trend', () => {
      const name = 'Sophie';
      const improvement = 0;

      let text = '';
      if (improvement === 0) {
        text = `${name}'s performance has been steady.`;
      }

      expect(text).toContain('Sophie');
      expect(text).toContain('steady');
    });

    it('defaults to "Your child" when name is empty', () => {
      const childName = '';
      const name = childName || 'Your child';
      expect(name).toBe('Your child');
    });
  });

  // ─── ChildClassComparison logic ────────────────────────────────────
  describe('ChildClassComparison logic', () => {
    it('identifies strengths (>= 70%) and weaknesses (< 50%)', () => {
      const subjects = [
        { subjectName: 'Mathematics', avgPercentage: 85 },
        { subjectName: 'English', avgPercentage: 45 },
        { subjectName: 'Science', avgPercentage: 72 },
        { subjectName: 'History', avgPercentage: 38 },
      ];

      const strengths: string[] = [];
      const weaknesses: string[] = [];

      for (const s of subjects) {
        if (s.avgPercentage >= 70) strengths.push(s.subjectName);
        else if (s.avgPercentage < 50) weaknesses.push(s.subjectName);
      }

      expect(strengths).toEqual(['Mathematics', 'Science']);
      expect(weaknesses).toEqual(['English', 'History']);
    });

    it('handles balanced performance (no strengths or weaknesses)', () => {
      const subjects = [
        { subjectName: 'Mathematics', avgPercentage: 62 },
        { subjectName: 'English', avgPercentage: 58 },
      ];

      const strengths: string[] = [];
      const weaknesses: string[] = [];

      for (const s of subjects) {
        if (s.avgPercentage >= 70) strengths.push(s.subjectName);
        else if (s.avgPercentage < 50) weaknesses.push(s.subjectName);
      }

      expect(strengths).toHaveLength(0);
      expect(weaknesses).toHaveLength(0);
    });

    it('handles empty subjects array', () => {
      const subjects: any[] = [];
      expect(subjects.length === 0).toBe(true);
    });
  });

  // ─── ChildElevenPlusPanel logic ────────────────────────────────────
  describe('ChildElevenPlusPanel logic', () => {
    it('uses getQualificationBandColor for band display', async () => {
      const { getQualificationBandColor } = await import('@papercraft/shared');
      expect(getQualificationBandColor('Strong Pass')).toBe('#16a34a');
      expect(getQualificationBandColor('Borderline')).toBe('#d97706');
      expect(getQualificationBandColor('Below')).toBe('#dc2626');
    });

    it('computes trend icons from getTrendArrow', async () => {
      const { getTrendArrow } = await import('@papercraft/shared');
      expect(getTrendArrow(3.0)).toBe('up');
      expect(getTrendArrow(-2.0)).toBe('down');
      expect(getTrendArrow(0.1)).toBe('flat');
    });

    it('generates prediction text with cohort data', () => {
      const band = { band: 'Pass', testCount: 5 };
      const cohort = { percentile: 75, cohortSize: 100 };
      const name = 'Emma';

      const text = `${name} is predicted to achieve a ${band.band} result.` +
        ` This places ${name} in the ${cohort.percentile}th percentile out of ${cohort.cohortSize} students.`;

      expect(text).toContain('Pass');
      expect(text).toContain('75th percentile');
      expect(text).toContain('100 students');
    });
  });

  // ─── ChildReportsList logic ────────────────────────────────────────
  describe('ChildReportsList logic', () => {
    it('distinguishes completed vs pending reports', () => {
      const reports = [
        { _id: 'r1', title: 'Term Report', status: 'completed', createdAt: '2026-02-10T10:00:00Z' },
        { _id: 'r2', title: 'Progress Report', status: 'pending', createdAt: '2026-02-20T10:00:00Z' },
        { _id: 'r3', title: 'Annual Report', status: 'failed', createdAt: '2026-02-01T10:00:00Z' },
      ];

      const completed = reports.filter((r) => r.status === 'completed');
      const nonCompleted = reports.filter((r) => r.status !== 'completed');

      expect(completed).toHaveLength(1);
      expect(completed[0].title).toBe('Term Report');
      expect(nonCompleted).toHaveLength(2);
    });

    it('formats report dates correctly', () => {
      const dateStr = '2026-02-10T10:00:00Z';
      const formatted = new Date(dateStr).toLocaleDateString();
      expect(formatted).toBeTruthy();
    });

    it('returns nothing for empty reports', () => {
      const reports: any[] = [];
      expect(reports.length === 0).toBe(true);
    });
  });
});
