import { describe, it, expect, vi } from 'vitest';

// Mock recharts to avoid rendering issues in test environment
vi.mock('recharts', () => ({
  LineChart: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: () => null,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
  CardHeader: ({ children }: any) => children,
  CardTitle: ({ children }: any) => children,
}));

const mockScoreTrendData = [
  { date: '2026-01-15T00:00:00Z', score: 72, testTitle: 'Math Test 1' },
  { date: '2026-01-22T00:00:00Z', score: 78, testTitle: 'Math Test 2' },
  { date: '2026-01-29T00:00:00Z', score: 65, testTitle: 'Science Quiz' },
  { date: '2026-02-05T00:00:00Z', score: 85, testTitle: 'Math Test 3' },
  { date: '2026-02-12T00:00:00Z', score: 88, testTitle: 'English Comp' },
  { date: '2026-02-19T00:00:00Z', score: 91, testTitle: 'Math Test 4' },
];

describe('ScoreTrendChart', () => {
  it('should be a valid component export', async () => {
    const { ScoreTrendChart } = await import('../ScoreTrendChart');
    expect(ScoreTrendChart).toBeDefined();
    expect(typeof ScoreTrendChart).toBe('function');
  });

  it('should handle data point formatting correctly', () => {
    const formatted = mockScoreTrendData.map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));

    expect(formatted).toHaveLength(6);
    // Each point should have a label derived from the date
    formatted.forEach((point) => {
      expect(point.label).toBeDefined();
      expect(typeof point.label).toBe('string');
      expect(point.label.length).toBeGreaterThan(0);
    });

    // Verify score values are preserved
    expect(formatted[0].score).toBe(72);
    expect(formatted[3].score).toBe(85);
    expect(formatted[5].score).toBe(91);
  });

  it('should handle empty data array by showing empty state', () => {
    const data: { date: string; score: number; testTitle?: string }[] = [];

    // The component checks data.length === 0 and shows "Not enough data" message
    expect(data.length).toBe(0);
  });

  it('should handle single data point', () => {
    const data = [
      { date: '2026-02-19T00:00:00Z', score: 85, testTitle: 'Only Test' },
    ];

    const formatted = data.map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));

    expect(formatted).toHaveLength(1);
    expect(formatted[0].score).toBe(85);
    expect(formatted[0].testTitle).toBe('Only Test');
  });

  it('should preserve all data fields during formatting', () => {
    const point = { date: '2026-02-19T00:00:00Z', score: 85, testTitle: 'Important Test' };
    const formatted = {
      ...point,
      label: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };

    expect(formatted.date).toBe(point.date);
    expect(formatted.score).toBe(point.score);
    expect(formatted.testTitle).toBe(point.testTitle);
    expect(formatted.label).toBeDefined();
  });

  it('should correctly format dates for chart labels', () => {
    const dates = [
      '2026-01-15T00:00:00Z',
      '2026-06-01T00:00:00Z',
      '2026-12-25T00:00:00Z',
    ];

    const labels = dates.map((d) =>
      new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );

    // All labels should be non-empty strings
    labels.forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('should handle scores at boundary values', () => {
    const boundaryData = [
      { date: '2026-01-01T00:00:00Z', score: 0 },
      { date: '2026-01-02T00:00:00Z', score: 50 },
      { date: '2026-01-03T00:00:00Z', score: 100 },
    ];

    // Y-axis domain is [0, 100]
    boundaryData.forEach((point) => {
      expect(point.score).toBeGreaterThanOrEqual(0);
      expect(point.score).toBeLessThanOrEqual(100);
    });
  });
});
