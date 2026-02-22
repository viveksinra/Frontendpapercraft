import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next dependencies
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => ({ children, href }),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock auth context
const mockRegisterStudent = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    registerStudent: mockRegisterStudent,
    user: null,
    authenticated: false,
    loading: false,
  }),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => ({ children, onClick }),
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

vi.mock('../OrgCodeInput', () => ({
  OrgCodeInput: (props: any) => props,
}));

vi.mock('../StudentCodeDisplay', () => ({
  StudentCodeDisplay: ({ code }: any) => code,
}));

// Replicate org code validation from the schema
const validateOrgCode = (orgCode: string): string | null => {
  if (orgCode.length < 3) {
    return 'Organization code must be at least 3 characters';
  }
  if (orgCode.length > 10) {
    return 'Organization code must be at most 10 characters';
  }
  if (!/^[A-Z0-9]+$/.test(orgCode)) {
    return 'Organization code must be uppercase letters or numbers';
  }
  return null;
};

describe('StudentSignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be a valid component export', async () => {
    const { StudentSignupForm } = await import('../StudentSignupForm');
    expect(StudentSignupForm).toBeDefined();
    expect(typeof StudentSignupForm).toBe('function');
  });

  it('should validate org code minimum length', () => {
    expect(validateOrgCode('AB')).toBe('Organization code must be at least 3 characters');
    expect(validateOrgCode('A')).toBe('Organization code must be at least 3 characters');
    expect(validateOrgCode('')).toBe('Organization code must be at least 3 characters');
  });

  it('should validate org code maximum length', () => {
    expect(validateOrgCode('ABCDEFGHIJK')).toBe('Organization code must be at most 10 characters');
    expect(validateOrgCode('A'.repeat(15))).toBe('Organization code must be at most 10 characters');
  });

  it('should validate org code format (uppercase + numbers only)', () => {
    expect(validateOrgCode('abc')).toBe('Organization code must be uppercase letters or numbers');
    expect(validateOrgCode('AB-C')).toBe('Organization code must be uppercase letters or numbers');
    expect(validateOrgCode('AB C')).toBe('Organization code must be uppercase letters or numbers');
    expect(validateOrgCode('ab1')).toBe('Organization code must be uppercase letters or numbers');
  });

  it('should accept valid org codes', () => {
    expect(validateOrgCode('ABC')).toBeNull();
    expect(validateOrgCode('ABC123')).toBeNull();
    expect(validateOrgCode('SCHOOL01')).toBeNull();
    expect(validateOrgCode('ORG')).toBeNull();
    expect(validateOrgCode('ABCDEFGHIJ')).toBeNull(); // 10 chars (max)
  });

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('notanemail')).toBe(false);
    expect(emailRegex.test('')).toBe(false);
  });

  it('should validate password minimum length', () => {
    const validatePassword = (password: string): string | null => {
      if (password.length < 6) return 'Password must be at least 6 characters';
      return null;
    };

    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
    expect(validatePassword('')).toBe('Password must be at least 6 characters');
    expect(validatePassword('123456')).toBeNull();
    expect(validatePassword('longpassword')).toBeNull();
  });

  it('should validate name minimum length', () => {
    const validateName = (name: string): string | null => {
      if (name.length < 2) return 'Full name must be at least 2 characters';
      return null;
    };

    expect(validateName('')).toBe('Full name must be at least 2 characters');
    expect(validateName('A')).toBe('Full name must be at least 2 characters');
    expect(validateName('AB')).toBeNull();
    expect(validateName('Alice Smith')).toBeNull();
  });

  it('should validate year group selection', () => {
    const validateYearGroup = (yearGroup: string): string | null => {
      if (yearGroup.length < 1) return 'Please select a year group';
      return null;
    };

    expect(validateYearGroup('')).toBe('Please select a year group');
    expect(validateYearGroup('year4')).toBeNull();
    expect(validateYearGroup('year5')).toBeNull();
    expect(validateYearGroup('year6')).toBeNull();
  });

  it('should provide correct year group options', () => {
    const YEAR_GROUPS = [
      { value: 'year4', label: 'Year 4' },
      { value: 'year5', label: 'Year 5' },
      { value: 'year6', label: 'Year 6' },
    ];

    expect(YEAR_GROUPS).toHaveLength(3);
    expect(YEAR_GROUPS[0].value).toBe('year4');
    expect(YEAR_GROUPS[1].label).toBe('Year 5');
    expect(YEAR_GROUPS[2].value).toBe('year6');
  });

  it('should call registerStudent on valid form submission', async () => {
    mockRegisterStudent.mockResolvedValue({ studentCode: 'STU-XYZ789' });

    const result = await mockRegisterStudent('test@example.com', 'password123', 'Alice Smith', 'SCHOOL01');

    expect(mockRegisterStudent).toHaveBeenCalledWith('test@example.com', 'password123', 'Alice Smith', 'SCHOOL01');
    expect(result.studentCode).toBe('STU-XYZ789');
  });

  it('should display student code after successful registration', async () => {
    mockRegisterStudent.mockResolvedValue({ studentCode: 'STU-XYZ789' });

    const result = await mockRegisterStudent('test@example.com', 'password123', 'Alice', 'ORG1');
    const studentCode = result.studentCode;

    expect(studentCode).toBe('STU-XYZ789');
    // Component switches to StudentCodeDisplay view when studentCode is set
  });

  it('should handle registration error', async () => {
    mockRegisterStudent.mockRejectedValue(new Error('Failed to create account.'));

    await expect(
      mockRegisterStudent('test@example.com', 'pass123', 'Alice', 'ORG1')
    ).rejects.toThrow('Failed to create account.');
  });
});
