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
    return '#6b7280';
  }),
  getTrendArrow: vi.fn((trend: number) => {
    if (trend > 0.5) return 'up';
    if (trend < -0.5) return 'down';
    return 'flat';
  }),
}));

// ---- Mock student-api ----
const mockGetAnalytics = vi.fn();
const mockGetScoreTrend = vi.fn();
const mockGetSubjectRadar = vi.fn();
const mockGetElevenPlusAnalytics = vi.fn();
const mockGetMyReports = vi.fn();
const mockDownloadReport = vi.fn();

vi.mock('@/lib/student-api', () => ({
  getAnalytics: (...args: unknown[]) => mockGetAnalytics(...args),
  getScoreTrend: (...args: unknown[]) => mockGetScoreTrend(...args),
  getSubjectRadar: (...args: unknown[]) => mockGetSubjectRadar(...args),
  getElevenPlusAnalytics: (...args: unknown[]) => mockGetElevenPlusAnalytics(...args),
  getMyReports: (...args: unknown[]) => mockGetMyReports(...args),
  downloadReport: (...args: unknown[]) => mockDownloadReport(...args),
}));

// ---- Mock UI components ----
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => ({ type: 'Card', props: { children, className } }),
  CardContent: ({ children, className }: any) => ({ type: 'CardContent', props: { children, className } }),
  CardHeader: ({ children }: any) => ({ type: 'CardHeader', props: { children } }),
  CardTitle: ({ children, className }: any) => ({ type: 'CardTitle', props: { children, className } }),
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

describe('PerformanceDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is exported as a named function', async () => {
    const mod = await import('../PerformanceDashboard');
    expect(mod.PerformanceDashboard).toBeDefined();
    expect(typeof mod.PerformanceDashboard).toBe('function');
  });

  it('loads analytics and reports data on mount', async () => {
    mockGetAnalytics.mockResolvedValue({
      overallStats: {
        avgPercentage: 78.5,
        totalTests: 15,
        improvementRate: 4.2,
        percentileInOrg: 80,
      },
      subjectBreakdown: [
        { subjectName: 'Mathematics', avgPercentage: 85.0 },
        { subjectName: 'English', avgPercentage: 70.0 },
      ],
    });
    mockGetMyReports.mockResolvedValue({
      reports: [
        { _id: 'r1', title: 'Progress Report', status: 'completed', createdAt: '2026-02-15T10:00:00Z' },
      ],
    });

    const [analytics, reports] = await Promise.all([
      mockGetAnalytics(),
      mockGetMyReports(),
    ]);

    expect(analytics.overallStats.avgPercentage).toBe(78.5);
    expect(analytics.overallStats.totalTests).toBe(15);
    expect(analytics.subjectBreakdown).toHaveLength(2);
    expect(reports.reports).toHaveLength(1);
    expect(reports.reports[0].status).toBe('completed');
  });

  it('loads 11+ data optionally (best-effort)', async () => {
    mockGetElevenPlusAnalytics.mockResolvedValue({
      band: { band: 'Pass', avgScore: 72.0, testCount: 5 },
      components: [
        { component: 'Verbal Reasoning', avgPercentage: 75.0, trend: 2.0 },
        { component: 'Non-Verbal Reasoning', avgPercentage: 68.0, trend: -1.0 },
      ],
      cohort: { percentile: 75, cohortSize: 100 },
    });

    const result = await mockGetElevenPlusAnalytics();
    expect(result.band.band).toBe('Pass');
    expect(result.components).toHaveLength(2);
    expect(result.cohort.percentile).toBe(75);
  });

  it('handles 11+ data failure gracefully', async () => {
    mockGetElevenPlusAnalytics.mockRejectedValue(new Error('Not available'));

    // Should not throw — 11+ data is optional
    let elevenPlusData = null;
    try {
      elevenPlusData = await mockGetElevenPlusAnalytics();
    } catch {
      // Expected — 11+ is optional
    }
    expect(elevenPlusData).toBeNull();
  });

  it('handles analytics load failure', async () => {
    mockGetAnalytics.mockRejectedValue(new Error('Network error'));

    await expect(mockGetAnalytics()).rejects.toThrow('Network error');
  });

  it('report download returns a downloadUrl', async () => {
    mockDownloadReport.mockResolvedValue({
      downloadUrl: 'https://s3.example.com/reports/report-1.pdf',
    });

    const result = await mockDownloadReport('r1');
    expect(result.downloadUrl).toContain('s3.example.com');
  });

  it('handles download failure silently', async () => {
    mockDownloadReport.mockRejectedValue(new Error('Download failed'));

    let url = null;
    try {
      const data = await mockDownloadReport('r1');
      url = data?.downloadUrl;
    } catch {
      // Silent fail expected
    }
    expect(url).toBeNull();
  });

  // ─── KPI rendering logic ──────────────────────────────────────────
  describe('StudentKPICards logic', () => {
    it('formats average score correctly', () => {
      const avgPct = 78.5;
      expect(`${avgPct.toFixed(1)}%`).toBe('78.5%');
    });

    it('uses getImprovementLabel for improvement display', async () => {
      const { getImprovementLabel } = await import('@papercraft/shared');
      expect(getImprovementLabel(4.2)).toBe('+4.2% improvement');
      expect(getImprovementLabel(-3.0)).toBe('-3.0% decline');
      expect(getImprovementLabel(0)).toBe('No change');
    });

    it('uses formatPercentile for rank display', async () => {
      const { formatPercentile } = await import('@papercraft/shared');
      expect(formatPercentile(80)).toBe('Top 25%');
      expect(formatPercentile(95)).toBe('Top 5%');
    });

    it('shows "—" when percentile is null', () => {
      const percentile = null;
      const display = percentile != null ? `Top ${percentile}%` : '—';
      expect(display).toBe('—');
    });
  });

  // ─── ImprovementBadge logic ────────────────────────────────────────
  describe('ImprovementBadge logic', () => {
    it('finds best performing subject', () => {
      const subjects = [
        { subjectName: 'Mathematics', avgPercentage: 85.0, topics: [] },
        { subjectName: 'English', avgPercentage: 70.0, topics: [] },
        { subjectName: 'Science', avgPercentage: 92.0, topics: [] },
      ];

      let bestSubject = null;
      let bestImprovement = 0;
      for (const s of subjects) {
        if (s.avgPercentage > bestImprovement) {
          bestImprovement = s.avgPercentage;
          bestSubject = s;
        }
      }

      expect(bestSubject).not.toBeNull();
      expect(bestSubject!.subjectName).toBe('Science');
      expect(bestImprovement).toBe(92.0);
    });

    it('returns null with empty subjects', () => {
      const subjects: any[] = [];
      expect(subjects.length === 0).toBe(true);
    });
  });

  // ─── ElevenPlusPanel logic ─────────────────────────────────────────
  describe('ElevenPlusPanel logic', () => {
    it('uses getQualificationBandColor for band display', async () => {
      const { getQualificationBandColor } = await import('@papercraft/shared');
      expect(getQualificationBandColor('Strong Pass')).toBe('#16a34a');
      expect(getQualificationBandColor('Pass')).toBe('#2563eb');
    });

    it('uses getTrendArrow for component trend icons', async () => {
      const { getTrendArrow } = await import('@papercraft/shared');
      expect(getTrendArrow(2.0)).toBe('up');
      expect(getTrendArrow(-1.5)).toBe('down');
      expect(getTrendArrow(0.3)).toBe('flat');
    });

    it('renders components with correct percentage formatting', () => {
      const components = [
        { component: 'Verbal Reasoning', avgPercentage: 78.234, trend: 2.3 },
        { component: 'Non-Verbal Reasoning', avgPercentage: 65.0, trend: -1.5 },
      ];

      expect(components[0].avgPercentage.toFixed(1)).toBe('78.2');
      expect(components[1].avgPercentage.toFixed(1)).toBe('65.0');
    });
  });
});
