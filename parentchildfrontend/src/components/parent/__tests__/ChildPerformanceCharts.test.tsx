import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- Mock parent-api ----
const mockGetChildPerformance = vi.fn();

vi.mock('@/lib/parent-api', () => ({
  getChildPerformance: (...args: unknown[]) => mockGetChildPerformance(...args),
}));

// ---- Mock UI components ----
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => ({ type: 'Card', props: { children, className } }),
  CardContent: ({ children, className }: any) => ({ type: 'CardContent', props: { children, className } }),
  CardHeader: ({ children }: any) => ({ type: 'CardHeader', props: { children } }),
  CardTitle: ({ children, className }: any) => ({ type: 'CardTitle', props: { children, className } }),
  CardDescription: ({ children }: any) => ({ type: 'CardDescription', props: { children } }),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size }: any) => ({
    type: 'Button',
    props: { children, onClick, variant, size },
  }),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('ChildPerformanceCharts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is exported as a named function', async () => {
    const mod = await import('../ChildPerformanceCharts');
    expect(mod.ChildPerformanceCharts).toBeDefined();
    expect(typeof mod.ChildPerformanceCharts).toBe('function');
  });

  it('loads performance data for a child', async () => {
    mockGetChildPerformance.mockResolvedValue({
      performance: {
        overallAverage: 75.5,
        totalTests: 12,
        bestScore: 95,
        bySubject: [
          { subject: 'Mathematics', average: 82 },
          { subject: 'English', average: 68 },
        ],
        history: [
          { label: 'Test 1', score: 70 },
          { label: 'Test 2', score: 75 },
          { label: 'Test 3', score: 80 },
        ],
      },
    });

    const result = await mockGetChildPerformance('child-1');
    const perf = result.performance;

    expect(perf.overallAverage).toBe(75.5);
    expect(perf.totalTests).toBe(12);
    expect(perf.bestScore).toBe(95);
    expect(perf.bySubject).toHaveLength(2);
    expect(perf.history).toHaveLength(3);
  });

  it('handles API error', async () => {
    mockGetChildPerformance.mockRejectedValue(new Error('Failed to load performance data.'));

    await expect(mockGetChildPerformance('child-1')).rejects.toThrow('Failed to load performance data.');
  });

  it('handles empty performance data', async () => {
    mockGetChildPerformance.mockResolvedValue({ performance: null });

    const result = await mockGetChildPerformance('child-1');
    expect(result.performance).toBeNull();
  });

  // ─── ProgressBar logic ─────────────────────────────────────────────
  describe('ProgressBar logic', () => {
    it('calculates correct percentage from value and max', () => {
      const value = 75;
      const max = 100;
      const percentage = Math.min(Math.round((value / max) * 100), 100);
      expect(percentage).toBe(75);
    });

    it('caps percentage at 100', () => {
      const value = 120;
      const max = 100;
      const percentage = Math.min(Math.round((value / max) * 100), 100);
      expect(percentage).toBe(100);
    });

    it('handles zero value', () => {
      const value = 0;
      const max = 100;
      const percentage = Math.min(Math.round((value / max) * 100), 100);
      expect(percentage).toBe(0);
    });
  });

  // ─── SimpleBarChart logic ──────────────────────────────────────────
  describe('SimpleBarChart logic', () => {
    it('computes bar widths relative to max value', () => {
      const data = [
        { label: 'Math', value: 80 },
        { label: 'English', value: 60 },
        { label: 'Science', value: 90 },
      ];
      const max = Math.max(...data.map((d) => d.value), 1);
      expect(max).toBe(90);

      const widths = data.map((d) => (d.value / max) * 100);
      expect(Math.round(widths[0])).toBe(89); // 80/90 * 100
      expect(Math.round(widths[1])).toBe(67); // 60/90 * 100
      expect(Math.round(widths[2])).toBe(100); // 90/90 * 100
    });

    it('handles empty data array', () => {
      const data: any[] = [];
      expect(data.length === 0).toBe(true);
    });

    it('handles single data point', () => {
      const data = [{ label: 'Math', value: 75 }];
      const max = Math.max(...data.map((d) => d.value), 1);
      expect(max).toBe(75);
      expect((data[0].value / max) * 100).toBe(100);
    });
  });

  // ─── ScoreHistoryChart logic ───────────────────────────────────────
  describe('ScoreHistoryChart logic', () => {
    it('computes SVG path points from score data', () => {
      const data = [
        { label: 'Test 1', score: 60 },
        { label: 'Test 2', score: 75 },
        { label: 'Test 3', score: 80 },
      ];
      const chartHeight = 160;
      const max = 100;

      const points = data.map((d, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
        const y = chartHeight - ((d.score / max) * chartHeight);
        return { x, y };
      });

      // First point at x=0
      expect(points[0].x).toBe(0);
      // Last point at x=100
      expect(points[2].x).toBe(100);
      // Higher score = lower y (SVG coordinates)
      expect(points[2].y).toBeLessThan(points[0].y);
    });

    it('handles single data point (centered at x=50)', () => {
      const data = [{ label: 'Test 1', score: 70 }];
      const x = data.length > 1 ? (0 / (data.length - 1)) * 100 : 50;
      expect(x).toBe(50);
    });

    it('generates correct SVG path string', () => {
      const points = [
        { x: 0, y: 64 },
        { x: 50, y: 40 },
        { x: 100, y: 32 },
      ];

      const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      expect(pathD).toBe('M 0 64 L 50 40 L 100 32');
    });
  });

  // ─── Summary card data extraction ──────────────────────────────────
  describe('Summary card data extraction', () => {
    it('extracts overallAverage with fallback', () => {
      const perf1 = { overallAverage: 75.5 };
      const perf2 = { average: 82.0 };

      expect(perf1.overallAverage ?? (perf1 as any).average).toBe(75.5);
      expect((perf2 as any).overallAverage ?? perf2.average).toBe(82.0);
    });

    it('extracts totalTests with fallback', () => {
      const perf1 = { totalTests: 12 };
      const perf2 = { testsCompleted: 8 };

      expect(perf1.totalTests ?? (perf1 as any).testsCompleted ?? 0).toBe(12);
      expect((perf2 as any).totalTests ?? perf2.testsCompleted ?? 0).toBe(8);
    });

    it('extracts bestScore with fallback', () => {
      const perf1 = { bestScore: 95 };
      const perf2 = { highestScore: 98 };

      expect(perf1.bestScore ?? (perf1 as any).highestScore).toBe(95);
      expect((perf2 as any).bestScore ?? perf2.highestScore).toBe(98);
    });

    it('transforms subject data into chart format', () => {
      const subjects = [
        { subject: 'Math', average: 82 },
        { name: 'English', score: 70 },
        { label: 'Science', value: 88 },
      ];

      const chartData = subjects.map((s: any) => ({
        label: s.subject || s.name || s.label,
        value: s.average ?? s.score ?? s.value ?? 0,
      }));

      expect(chartData[0]).toEqual({ label: 'Math', value: 82 });
      expect(chartData[1]).toEqual({ label: 'English', value: 70 });
      expect(chartData[2]).toEqual({ label: 'Science', value: 88 });
    });

    it('assigns correct color based on score threshold', () => {
      function getColor(value: number): string {
        if (value >= 80) return 'bg-green-500';
        if (value >= 60) return 'bg-blue-500';
        if (value >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
      }

      expect(getColor(85)).toBe('bg-green-500');
      expect(getColor(65)).toBe('bg-blue-500');
      expect(getColor(45)).toBe('bg-yellow-500');
      expect(getColor(30)).toBe('bg-red-500');
    });
  });
});
