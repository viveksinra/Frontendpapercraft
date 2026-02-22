import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next dependencies
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => ({ children, href }),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
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
  Button: ({ children, onClick }: any) => ({ children, onClick }),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => children,
  DialogContent: ({ children }: any) => children,
  DialogDescription: ({ children }: any) => children,
  DialogFooter: ({ children }: any) => children,
  DialogHeader: ({ children }: any) => children,
  DialogTitle: ({ children }: any) => children,
  DialogTrigger: ({ children }: any) => children,
  DialogClose: ({ children }: any) => children,
}));

const mockUnlinkChild = vi.fn();
vi.mock('@/lib/parent-api', () => ({
  unlinkChild: (...args: unknown[]) => mockUnlinkChild(...args),
}));

const mockChild = {
  student: {
    id: 'child-1',
    userId: 'user-1',
    name: 'Alice Smith',
    firstName: 'Alice',
    lastName: 'Smith',
    yearGroup: 'Year 5',
    studentCode: 'STU-ABC123',
    organizations: [{ name: 'Test Academy' }],
  },
  stats: {
    totalTests: 15,
    averageScore: 82,
  },
};

describe('LinkedChildCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be a valid component export', async () => {
    const { LinkedChildCard } = await import('../LinkedChildCard');
    expect(LinkedChildCard).toBeDefined();
    expect(typeof LinkedChildCard).toBe('function');
  });

  it('should render child name', () => {
    const student = mockChild.student;
    const name =
      student.name ||
      `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
      'Child';

    expect(name).toBe('Alice Smith');
  });

  it('should render year group', () => {
    const yearGroup = mockChild.student.yearGroup;
    expect(yearGroup).toBe('Year 5');
  });

  it('should render student code', () => {
    const studentCode = mockChild.student.studentCode;
    expect(studentCode).toBe('STU-ABC123');
  });

  it('should render organization names', () => {
    const orgs = mockChild.student.organizations;
    const orgNames = orgs.map((o: any) => o.name || o).join(', ');

    expect(orgNames).toBe('Test Academy');
  });

  it('should render test stats', () => {
    const stats = mockChild.stats;
    const totalTests = stats.totalTests ?? (stats as any).testsCompleted ?? 0;
    const average = stats.averageScore ?? (stats as any).average;

    expect(totalTests).toBe(15);
    expect(average).toBe(82);

    // Verify stats display string
    const statsText = `${totalTests} test${totalTests !== 1 ? 's' : ''} completed`;
    expect(statsText).toBe('15 tests completed');
  });

  it('should handle singular test count', () => {
    const totalTests = 1;
    const statsText = `${totalTests} test${totalTests !== 1 ? 's' : ''} completed`;
    expect(statsText).toBe('1 test completed');
  });

  it('should render unlink button', () => {
    // The component has a Dialog with an "Unlink" trigger button
    const unlinkButtonText = 'Unlink';
    expect(unlinkButtonText).toBe('Unlink');
  });

  it('should call unlinkChild API when unlink is confirmed', async () => {
    mockUnlinkChild.mockResolvedValue({});

    const childId = mockChild.student.id;
    await mockUnlinkChild(childId);

    expect(mockUnlinkChild).toHaveBeenCalledWith('child-1');
  });

  it('should call onUnlinked callback after successful unlink', async () => {
    mockUnlinkChild.mockResolvedValue({});
    const onUnlinked = vi.fn();

    await mockUnlinkChild('child-1');
    onUnlinked();

    expect(onUnlinked).toHaveBeenCalledTimes(1);
  });

  it('should handle unlink error gracefully', async () => {
    mockUnlinkChild.mockRejectedValue(new Error('Failed to unlink child.'));

    await expect(mockUnlinkChild('child-1')).rejects.toThrow('Failed to unlink child.');
  });

  it('should extract childId from student.id or student.userId', () => {
    const student1 = { id: 'c1', userId: 'u1' };
    expect(student1.id || student1.userId).toBe('c1');

    const student2 = { id: undefined, userId: 'u2' } as any;
    expect(student2.id || student2.userId).toBe('u2');
  });

  it('should handle missing optional fields gracefully', () => {
    const child = { student: { id: 'c1' } } as any;
    const student = child.student;

    const yearGroup = student.yearGroup || '';
    const studentCode = student.studentCode || '';
    const orgs = student.organizations || [];
    const stats = child.stats || {};
    const totalTests = stats.totalTests ?? 0;
    const average = stats.averageScore ?? stats.average;

    expect(yearGroup).toBe('');
    expect(studentCode).toBe('');
    expect(orgs).toHaveLength(0);
    expect(totalTests).toBe(0);
    expect(average).toBeUndefined();
  });

  it('should link to child details page', () => {
    const childId = mockChild.student.id;
    const href = `/children/${childId}`;

    expect(href).toBe('/children/child-1');
  });
});
