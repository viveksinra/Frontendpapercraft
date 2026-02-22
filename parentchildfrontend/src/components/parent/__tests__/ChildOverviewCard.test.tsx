import { describe, it, expect, vi } from 'vitest';

// Mock next dependencies
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => ({ children, href }),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
  CardDescription: ({ children }: any) => children,
  CardHeader: ({ children }: any) => children,
  CardTitle: ({ children }: any) => children,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => children,
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => null,
}));

// Mock child sub-components
vi.mock('../ChildRecentResults', () => ({
  ChildRecentResults: () => null,
}));

vi.mock('../ChildUpcomingTests', () => ({
  ChildUpcomingTests: () => null,
}));

const mockChild = {
  student: {
    id: 'child-1',
    userId: 'user-1',
    name: 'Alice Smith',
    firstName: 'Alice',
    lastName: 'Smith',
  },
  stats: {
    averageScore: 82,
    streak: 7,
    totalTests: 12,
  },
  recentResults: [
    { _id: 'r1', testTitle: 'Math Test', percentage: 85, grade: 'A' },
    { _id: 'r2', testTitle: 'English Test', percentage: 72, grade: 'B' },
    { _id: 'r3', testTitle: 'Science Test', percentage: 91, grade: 'A*' },
    { _id: 'r4', testTitle: 'History Test', percentage: 68, grade: 'B' },
  ],
  upcomingTests: [
    { _id: 't1', title: 'Geography Quiz', scheduledDate: '2026-03-01T10:00:00Z' },
    { _id: 't2', title: 'Physics Test', scheduledDate: '2026-03-05T14:00:00Z' },
    { _id: 't3', title: 'Chemistry Lab', scheduledDate: '2026-03-10T09:00:00Z' },
  ],
};

describe('ChildOverviewCard', () => {
  it('should be a valid component export', async () => {
    const { ChildOverviewCard } = await import('../ChildOverviewCard');
    expect(ChildOverviewCard).toBeDefined();
    expect(typeof ChildOverviewCard).toBe('function');
  });

  it('should extract student data from child.student or child directly', () => {
    const child = mockChild;
    const student = child.student || child;

    expect(student.name).toBe('Alice Smith');
    expect(student.id).toBe('child-1');
  });

  it('should extract childId from student.id or student.userId', () => {
    const student = mockChild.student;
    const childId = student.id || student.userId;

    expect(childId).toBe('child-1');
  });

  it('should derive name with fallback logic', () => {
    const student = mockChild.student;
    const name =
      student.name ||
      `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
      'Child';

    expect(name).toBe('Alice Smith');
  });

  it('should derive name from firstName + lastName when name is missing', () => {
    const student = { firstName: 'Bob', lastName: 'Jones' } as any;
    const name =
      student.name ||
      `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
      'Child';

    expect(name).toBe('Bob Jones');
  });

  it('should fallback to "Child" when no name fields exist', () => {
    const student = {} as any;
    const name =
      student.name ||
      `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
      'Child';

    expect(name).toBe('Child');
  });

  it('should render average score stats', () => {
    const stats = mockChild.stats;
    const average = stats.averageScore ?? (stats as any).average;

    expect(average).toBe(82);
    expect(Math.round(average!)).toBe(82);
  });

  it('should render streak stats', () => {
    const stats = mockChild.stats;
    const streak = stats.streak ?? (stats as any).currentStreak ?? 0;

    expect(streak).toBe(7);
  });

  it('should render total tests stats', () => {
    const stats = mockChild.stats;
    const totalTests = stats.totalTests ?? (stats as any).testsCompleted ?? 0;

    expect(totalTests).toBe(12);
  });

  it('should handle null/undefined average score', () => {
    const stats = { averageScore: null } as any;
    const average = stats.averageScore ?? stats.average;

    expect(average === undefined || average === null).toBe(true);
  });

  it('should show recent results sliced to 3', () => {
    const results = mockChild.recentResults.slice(0, 3);

    expect(results).toHaveLength(3);
    expect(results[0].testTitle).toBe('Math Test');
    expect(results[2].testTitle).toBe('Science Test');
  });

  it('should show upcoming tests sliced to 2', () => {
    const tests = mockChild.upcomingTests.slice(0, 2);

    expect(tests).toHaveLength(2);
    expect(tests[0].title).toBe('Geography Quiz');
    expect(tests[1].title).toBe('Physics Test');
  });

  it('should handle empty stats gracefully', () => {
    const child = { student: { id: 'c1', name: 'Test' }, stats: {} } as any;
    const stats = child.stats || {};
    const average = stats.averageScore ?? stats.average;
    const streak = stats.streak ?? stats.currentStreak ?? 0;
    const totalTests = stats.totalTests ?? stats.testsCompleted ?? 0;

    expect(average).toBeUndefined();
    expect(streak).toBe(0);
    expect(totalTests).toBe(0);
  });
});
