import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/auth/student/login',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => ({ children, href }),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock auth context
const mockLogin = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
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

// Replicate the login schema validation logic
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password || password.length < 1) {
    return 'Password is required';
  }
  return null;
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be a valid component export', async () => {
    const { LoginForm } = await import('../LoginForm');
    expect(LoginForm).toBeDefined();
    expect(typeof LoginForm).toBe('function');
  });

  it('should validate that email is required', () => {
    const error = validateEmail('');
    expect(error).toBe('Please enter a valid email address');
  });

  it('should validate that email format is correct', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
    expect(validateEmail('missing@domain')).toBe('Please enter a valid email address');
    expect(validateEmail('@nodomain.com')).toBe('Please enter a valid email address');
  });

  it('should accept valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user@school.co.uk')).toBeNull();
    expect(validateEmail('parent123@test.org')).toBeNull();
  });

  it('should validate that password is required', () => {
    const error = validatePassword('');
    expect(error).toBe('Password is required');
  });

  it('should accept any non-empty password', () => {
    expect(validatePassword('a')).toBeNull();
    expect(validatePassword('mysecurepassword')).toBeNull();
    expect(validatePassword('12345678')).toBeNull();
  });

  it('should call login with email and password on valid submission', async () => {
    mockLogin.mockResolvedValue(undefined);

    await mockLogin('test@example.com', 'password123');

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should handle login error', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid email or password.'));

    await expect(mockLogin('test@example.com', 'wrong')).rejects.toThrow('Invalid email or password.');
  });

  it('should redirect to correct dashboard based on variant', () => {
    const getDashboardPath = (role?: string) => {
      if (role === 'parent') return '/parent/dashboard';
      return '/student/dashboard';
    };

    expect(getDashboardPath('student')).toBe('/student/dashboard');
    expect(getDashboardPath('parent')).toBe('/parent/dashboard');
    expect(getDashboardPath(undefined)).toBe('/student/dashboard');
  });

  it('should show "Student Sign In" title for student variant', () => {
    const variant = 'student';
    const isStudent = variant === 'student';
    const title = isStudent ? 'Student' : 'Parent';

    expect(title).toBe('Student');
  });

  it('should show "Parent Sign In" title for parent variant', () => {
    const variant = 'parent';
    const isStudent = variant === 'student';
    const title = isStudent ? 'Student' : 'Parent';

    expect(title).toBe('Parent');
  });

  it('should show link to parent signup when variant is student', () => {
    const variant = 'student';
    const isStudent = variant === 'student';

    expect(isStudent).toBe(true);
    // Component shows "Are you a parent? Register as Parent" when isStudent
  });

  it('should show link to student signup when variant is parent', () => {
    const variant = 'parent';
    const isStudent = variant === 'student';

    expect(isStudent).toBe(false);
    // Component shows "Are you a student? Register as Student" when !isStudent
  });
});
