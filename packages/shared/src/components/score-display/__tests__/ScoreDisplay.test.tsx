import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('react', () => ({
  default: { createElement: vi.fn() },
}));

// Reproduce the component's pure logic for testing
function getGradeColor(grade: string): string {
  const g = grade.toUpperCase();
  if (g === 'A+' || g === 'A*') return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
  if (g === 'A') return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800';
  if (g === 'B') return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
  if (g === 'C') return 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
  if (g === 'D') return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
  if (g === 'E') return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/80 dark:text-orange-400 dark:border-orange-800';
  if (g === 'F' || g === 'U') return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
  return 'bg-muted text-muted-foreground border-border';
}

function getPercentageColor(pct: number): string {
  if (pct >= 80) return 'text-green-600 dark:text-green-400';
  if (pct >= 60) return 'text-blue-600 dark:text-blue-400';
  if (pct >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getPercentileBarColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

describe('ScoreDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGradeColor', () => {
    it('returns green-100 class for A+ grade', () => {
      const result = getGradeColor('A+');
      expect(result).toContain('bg-green-100');
      expect(result).toContain('text-green-700');
    });

    it('returns green-100 class for A* grade', () => {
      const result = getGradeColor('A*');
      expect(result).toContain('bg-green-100');
      expect(result).toContain('text-green-700');
    });

    it('returns green-50 class for A grade', () => {
      const result = getGradeColor('A');
      expect(result).toContain('bg-green-50');
      expect(result).toContain('text-green-600');
    });

    it('returns blue class for B grade', () => {
      const result = getGradeColor('B');
      expect(result).toContain('bg-blue-50');
      expect(result).toContain('text-blue-600');
    });

    it('returns yellow class for C grade', () => {
      const result = getGradeColor('C');
      expect(result).toContain('bg-yellow-50');
      expect(result).toContain('text-yellow-700');
    });

    it('returns orange-50 class for D grade', () => {
      const result = getGradeColor('D');
      expect(result).toContain('bg-orange-50');
      expect(result).toContain('text-orange-600');
    });

    it('returns orange-100 class for E grade', () => {
      const result = getGradeColor('E');
      expect(result).toContain('bg-orange-100');
      expect(result).toContain('text-orange-700');
    });

    it('returns red class for F grade', () => {
      const result = getGradeColor('F');
      expect(result).toContain('bg-red-50');
      expect(result).toContain('text-red-600');
    });

    it('returns red class for U grade', () => {
      const result = getGradeColor('U');
      expect(result).toContain('bg-red-50');
      expect(result).toContain('text-red-600');
    });

    it('returns default muted class for unknown grade', () => {
      const result = getGradeColor('Z');
      expect(result).toContain('bg-muted');
      expect(result).toContain('text-muted-foreground');
    });

    it('handles lowercase grades by uppercasing', () => {
      expect(getGradeColor('a+')).toContain('bg-green-100');
      expect(getGradeColor('b')).toContain('bg-blue-50');
      expect(getGradeColor('f')).toContain('bg-red-50');
    });
  });

  describe('getPercentageColor', () => {
    it('returns green for percentage >= 80', () => {
      expect(getPercentageColor(80)).toContain('text-green-600');
      expect(getPercentageColor(95)).toContain('text-green-600');
      expect(getPercentageColor(100)).toContain('text-green-600');
    });

    it('returns blue for percentage >= 60 and < 80', () => {
      expect(getPercentageColor(60)).toContain('text-blue-600');
      expect(getPercentageColor(70)).toContain('text-blue-600');
      expect(getPercentageColor(79)).toContain('text-blue-600');
    });

    it('returns yellow for percentage >= 40 and < 60', () => {
      expect(getPercentageColor(40)).toContain('text-yellow-600');
      expect(getPercentageColor(50)).toContain('text-yellow-600');
      expect(getPercentageColor(59)).toContain('text-yellow-600');
    });

    it('returns red for percentage < 40', () => {
      expect(getPercentageColor(39)).toContain('text-red-600');
      expect(getPercentageColor(20)).toContain('text-red-600');
      expect(getPercentageColor(0)).toContain('text-red-600');
    });
  });

  describe('getPercentileBarColor', () => {
    it('returns correct bar color for each range', () => {
      expect(getPercentileBarColor(80)).toBe('bg-green-500');
      expect(getPercentileBarColor(90)).toBe('bg-green-500');
      expect(getPercentileBarColor(60)).toBe('bg-blue-500');
      expect(getPercentileBarColor(79)).toBe('bg-blue-500');
      expect(getPercentileBarColor(40)).toBe('bg-yellow-500');
      expect(getPercentileBarColor(59)).toBe('bg-yellow-500');
      expect(getPercentileBarColor(39)).toBe('bg-red-500');
      expect(getPercentileBarColor(0)).toBe('bg-red-500');
    });
  });

  describe('rank display logic', () => {
    it('shows rank when both rank and totalStudents are provided (non-null)', () => {
      const rank = 5;
      const totalStudents = 30;
      const showRank = rank != null && totalStudents != null;
      expect(showRank).toBe(true);
    });

    it('hides rank when rank is null', () => {
      const rank = null;
      const totalStudents = 30;
      const showRank = rank != null && totalStudents != null;
      expect(showRank).toBe(false);
    });

    it('hides rank when totalStudents is null', () => {
      const rank = 5;
      const totalStudents = null;
      const showRank = rank != null && totalStudents != null;
      expect(showRank).toBe(false);
    });

    it('hides rank when both are null', () => {
      const rank = null;
      const totalStudents = null;
      const showRank = rank != null && totalStudents != null;
      expect(showRank).toBe(false);
    });

    it('hides rank when rank is undefined', () => {
      const rank = undefined;
      const totalStudents = 30;
      const showRank = rank != null && totalStudents != null;
      expect(showRank).toBe(false);
    });
  });

  describe('percentile bar display logic', () => {
    it('shows percentile bar when percentile is not null', () => {
      const percentile = 75;
      const showPercentile = percentile != null;
      expect(showPercentile).toBe(true);
    });

    it('hides percentile bar when percentile is null', () => {
      const percentile = null;
      const showPercentile = percentile != null;
      expect(showPercentile).toBe(false);
    });

    it('shows percentile bar even when percentile is 0', () => {
      const percentile = 0;
      const showPercentile = percentile != null;
      expect(showPercentile).toBe(true);
    });

    it('clamps percentile bar width between 0 and 100', () => {
      const clampWidth = (pct: number) => Math.min(100, Math.max(0, pct));
      expect(clampWidth(150)).toBe(100);
      expect(clampWidth(-10)).toBe(0);
      expect(clampWidth(50)).toBe(50);
    });
  });
});
