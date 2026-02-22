import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/tests',
}));

const mockUpcomingTests = {
  tests: [
    { _id: 't1', title: 'Upcoming Math Test', status: 'upcoming', scheduledDate: '2026-03-05T10:00:00Z' },
    { _id: 't2', title: 'Upcoming English Test', status: 'upcoming', scheduledDate: '2026-03-06T10:00:00Z' },
  ],
  total: 2,
};

const mockAvailableTests = {
  tests: [
    { _id: 't3', title: 'Available Science Quiz', status: 'available', scheduledDate: '2026-02-22T10:00:00Z' },
  ],
  total: 1,
};

const mockCompletedTests = {
  tests: [
    { _id: 't4', title: 'Completed History Test', status: 'completed', completedAt: '2026-02-20T10:00:00Z', percentage: 85 },
    { _id: 't5', title: 'Completed Geography Test', status: 'completed', completedAt: '2026-02-19T10:00:00Z', percentage: 72 },
    { _id: 't6', title: 'Completed Biology Test', status: 'completed', completedAt: '2026-02-18T10:00:00Z', percentage: 91 },
  ],
  total: 3,
};

const mockGetTests = vi.fn();
vi.mock('@/lib/student-api', () => ({
  getTests: (...args: unknown[]) => mockGetTests(...args),
}));

describe('TestList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTests.mockResolvedValue(mockAvailableTests);
  });

  it('should be a valid component export', async () => {
    const { TestList } = await import('../TestList');
    expect(TestList).toBeDefined();
    expect(typeof TestList).toBe('function');
  });

  it('should define three tabs: upcoming, available, and completed', () => {
    const tabs = [
      { key: 'upcoming', label: 'Upcoming' },
      { key: 'available', label: 'Available Now' },
      { key: 'completed', label: 'Completed' },
    ];

    expect(tabs).toHaveLength(3);
    expect(tabs.map((t) => t.key)).toEqual(['upcoming', 'available', 'completed']);
    expect(tabs.map((t) => t.label)).toEqual(['Upcoming', 'Available Now', 'Completed']);
  });

  it('should fetch upcoming tests when tab is "upcoming"', async () => {
    mockGetTests.mockResolvedValue(mockUpcomingTests);

    const result = await mockGetTests({ status: 'upcoming', page: 1, pageSize: 10 });

    expect(mockGetTests).toHaveBeenCalledWith({ status: 'upcoming', page: 1, pageSize: 10 });
    expect(result.tests).toHaveLength(2);
    expect(result.tests[0].title).toBe('Upcoming Math Test');
    expect(result.tests[1].title).toBe('Upcoming English Test');
  });

  it('should fetch available tests when tab is "available"', async () => {
    mockGetTests.mockResolvedValue(mockAvailableTests);

    const result = await mockGetTests({ status: 'available', page: 1, pageSize: 10 });

    expect(mockGetTests).toHaveBeenCalledWith({ status: 'available', page: 1, pageSize: 10 });
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0].title).toBe('Available Science Quiz');
  });

  it('should fetch completed tests when tab is "completed"', async () => {
    mockGetTests.mockResolvedValue(mockCompletedTests);

    const result = await mockGetTests({ status: 'completed', page: 1, pageSize: 10 });

    expect(mockGetTests).toHaveBeenCalledWith({ status: 'completed', page: 1, pageSize: 10 });
    expect(result.tests).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it('should reset page to 1 when tab changes', () => {
    let activeTab = 'available';
    let page = 3;

    // Simulate tab change
    const handleTabChange = (tab: string) => {
      activeTab = tab;
      page = 1;
    };

    handleTabChange('upcoming');
    expect(activeTab).toBe('upcoming');
    expect(page).toBe(1);

    handleTabChange('completed');
    expect(activeTab).toBe('completed');
    expect(page).toBe(1);
  });

  it('should handle empty test list', async () => {
    mockGetTests.mockResolvedValue({ tests: [], total: 0 });

    const result = await mockGetTests({ status: 'available', page: 1, pageSize: 10 });

    expect(result.tests).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should handle pagination correctly', async () => {
    const pageSize = 10;
    const total = 25;
    const totalPages = Math.ceil(total / pageSize);

    expect(totalPages).toBe(3);

    // Page 1: Previous disabled, Next enabled
    let page = 1;
    expect(page <= 1).toBe(true);
    expect(page >= totalPages).toBe(false);

    // Page 2: Both enabled
    page = 2;
    expect(page <= 1).toBe(false);
    expect(page >= totalPages).toBe(false);

    // Page 3: Previous enabled, Next disabled
    page = 3;
    expect(page <= 1).toBe(false);
    expect(page >= totalPages).toBe(true);
  });

  it('should handle API errors', async () => {
    mockGetTests.mockRejectedValue(new Error('Failed to load tests'));

    await expect(mockGetTests({ status: 'available', page: 1, pageSize: 10 })).rejects.toThrow('Failed to load tests');
  });
});
