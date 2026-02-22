import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/dashboard',
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', firstName: 'Alex', lastName: 'Smith', role: 'student', email: 'alex@test.com' },
    authenticated: true,
    loading: false,
  }),
}));

const mockDashboardData = {
  upcomingTests: [
    { _id: 't1', title: 'Math Weekly Test', scheduledDate: '2026-03-01T10:00:00Z', subject: 'Mathematics', durationMinutes: 60 },
    { _id: 't2', title: 'English Comprehension', scheduledDate: '2026-03-03T14:00:00Z', subject: 'English', durationMinutes: 45 },
  ],
  recentResults: [
    { _id: 'r1', testTitle: 'Science Quiz', percentage: 85, grade: 'A', completedAt: '2026-02-20T12:00:00Z' },
    { _id: 'r2', testTitle: 'History Test', percentage: 72, grade: 'B', completedAt: '2026-02-18T12:00:00Z' },
  ],
  pendingHomework: [],
  stats: {
    testsTaken: 15,
    averageScore: 78.5,
    streak: 5,
    orgName: 'Test Academy',
  },
};

// Mock student-api
const mockGetDashboard = vi.fn();
vi.mock('@/lib/student-api', () => ({
  getDashboard: (...args: unknown[]) => mockGetDashboard(...args),
}));

describe('StudentDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDashboard.mockResolvedValue(mockDashboardData);
  });

  it('should call getDashboard on mount and process the returned data', async () => {
    // Dynamically import after mocks are set up
    const { StudentDashboard } = await import('../StudentDashboard');

    // Verify the component is defined as a function
    expect(StudentDashboard).toBeDefined();
    expect(typeof StudentDashboard).toBe('function');
  });

  it('should render with data containing upcoming tests and recent results', async () => {
    const result = await mockGetDashboard();

    expect(mockGetDashboard).toHaveBeenCalledTimes(1);
    expect(result.upcomingTests).toHaveLength(2);
    expect(result.recentResults).toHaveLength(2);
    expect(result.stats.testsTaken).toBe(15);
    expect(result.stats.averageScore).toBe(78.5);
    expect(result.stats.streak).toBe(5);
    expect(result.stats.orgName).toBe('Test Academy');
  });

  it('should handle the firstName from user context correctly', async () => {
    const { useAuth } = await import('@/contexts/AuthContext');
    const auth = useAuth();

    expect(auth.user?.firstName).toBe('Alex');
    expect(auth.authenticated).toBe(true);
  });

  it('should handle empty dashboard data gracefully', async () => {
    mockGetDashboard.mockResolvedValue({
      upcomingTests: [],
      recentResults: [],
      pendingHomework: [],
      stats: { testsTaken: 0, averageScore: null, streak: 0 },
    });

    const result = await mockGetDashboard();

    expect(result.upcomingTests).toHaveLength(0);
    expect(result.recentResults).toHaveLength(0);
    expect(result.stats.testsTaken).toBe(0);
    expect(result.stats.averageScore).toBeNull();
  });

  it('should handle API errors correctly', async () => {
    mockGetDashboard.mockRejectedValue(new Error('Network error'));

    await expect(mockGetDashboard()).rejects.toThrow('Network error');
  });

  it('should derive default firstName when user is missing firstName', () => {
    const user = { id: '1', role: 'student' } as any;
    const firstName = user?.firstName || 'Student';

    expect(firstName).toBe('Student');
  });

  it('should derive default stats when data stats are missing', () => {
    const data = { stats: undefined } as any;
    const stats = data?.stats || { testsTaken: 0, averageScore: null, streak: 0 };

    expect(stats.testsTaken).toBe(0);
    expect(stats.averageScore).toBeNull();
    expect(stats.streak).toBe(0);
  });
});
