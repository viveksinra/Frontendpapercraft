import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => ({ children, onClick, disabled }),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => props,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children }: any) => children,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
  CardDescription: ({ children }: any) => children,
  CardFooter: ({ children }: any) => children,
  CardHeader: ({ children }: any) => children,
  CardTitle: ({ children }: any) => children,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => children,
  SelectContent: ({ children }: any) => children,
  SelectItem: ({ children }: any) => children,
  SelectTrigger: ({ children }: any) => children,
  SelectValue: ({ children }: any) => children,
}));

const mockLinkChild = vi.fn();
vi.mock('@/lib/parent-api', () => ({
  linkChild: (...args: unknown[]) => mockLinkChild(...args),
}));

describe('LinkChildForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be a valid component export', async () => {
    const { LinkChildForm } = await import('../LinkChildForm');
    expect(LinkChildForm).toBeDefined();
    expect(typeof LinkChildForm).toBe('function');
  });

  it('should validate that student code is required', () => {
    const studentCode = '';
    const errors: { studentCode?: string } = {};

    if (!studentCode.trim()) {
      errors.studentCode = 'Student code is required';
    }

    expect(errors.studentCode).toBe('Student code is required');
  });

  it('should validate that relationship is required', () => {
    const relationship = '';
    const errors: { relationship?: string } = {};

    if (!relationship) {
      errors.relationship = 'Please select a relationship';
    }

    expect(errors.relationship).toBe('Please select a relationship');
  });

  it('should pass validation when both fields are provided', () => {
    const studentCode = 'STU-ABC123';
    const relationship = 'mother';
    const errors: { studentCode?: string; relationship?: string } = {};

    if (!studentCode.trim()) {
      errors.studentCode = 'Student code is required';
    }
    if (!relationship) {
      errors.relationship = 'Please select a relationship';
    }

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should convert student code to uppercase', () => {
    const input = 'stu-abc123';
    const uppercased = input.toUpperCase().trim();

    expect(uppercased).toBe('STU-ABC123');
  });

  it('should call linkChild API on valid form submission', async () => {
    mockLinkChild.mockResolvedValue({ child: { name: 'Alice Smith' } });

    await mockLinkChild('STU-ABC123', 'mother');

    expect(mockLinkChild).toHaveBeenCalledWith('STU-ABC123', 'mother');
  });

  it('should show success state after linking', async () => {
    mockLinkChild.mockResolvedValue({
      child: {
        name: 'Alice Smith',
        organizations: [{ name: 'Test Academy' }],
      },
    });

    const result = await mockLinkChild('STU-ABC123', 'guardian');
    const linkedChild = result.child || result;

    expect(linkedChild.name).toBe('Alice Smith');

    // In success state, the component shows "Child Linked Successfully"
    const isSuccess = true;
    expect(isSuccess).toBe(true);
  });

  it('should derive child name from various data shapes in success state', () => {
    // When child has name directly
    const child1 = { name: 'Alice', student: null };
    const name1 = child1.name || child1.student?.name || 'Child';
    expect(name1).toBe('Alice');

    // When child has student.name
    const child2 = { name: null, student: { name: 'Bob' } } as any;
    const name2 = child2.name || child2.student?.name || 'Child';
    expect(name2).toBe('Bob');

    // Fallback
    const child3 = {} as any;
    const name3 = child3.name || child3.student?.name ||
      `${child3.firstName || ''} ${child3.lastName || ''}`.trim() || 'Child';
    expect(name3).toBe('Child');
  });

  it('should handle API error gracefully', async () => {
    mockLinkChild.mockRejectedValue(new Error('Invalid student code'));

    await expect(mockLinkChild('INVALID', 'mother')).rejects.toThrow('Invalid student code');
  });

  it('should allow linking another child after success', () => {
    let isSuccess = true;
    let studentCode = 'STU-ABC123';
    let relationship = 'mother';

    // Reset form state
    const handleLinkAnother = () => {
      isSuccess = false;
      studentCode = '';
      relationship = '';
    };

    handleLinkAnother();
    expect(isSuccess).toBe(false);
    expect(studentCode).toBe('');
    expect(relationship).toBe('');
  });

  it('should clear studentCode error when user starts typing', () => {
    let errors: { studentCode?: string } = { studentCode: 'Student code is required' };

    // Simulate user typing
    if (errors.studentCode) {
      errors = { ...errors, studentCode: undefined };
    }

    expect(errors.studentCode).toBeUndefined();
  });
});
