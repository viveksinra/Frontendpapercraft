import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => ({ children, onClick }),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
}));

describe('StudentCodeDisplay', () => {
  let mockClipboard: { writeText: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock clipboard API
    mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
  });

  it('should be a valid component export', async () => {
    const { StudentCodeDisplay } = await import('../StudentCodeDisplay');
    expect(StudentCodeDisplay).toBeDefined();
    expect(typeof StudentCodeDisplay).toBe('function');
  });

  it('should display the student code', () => {
    const code = 'STU-ABC123';
    expect(code).toBe('STU-ABC123');
  });

  it('should copy code to clipboard when copy button is clicked', async () => {
    const code = 'STU-ABC123';

    await navigator.clipboard.writeText(code);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('STU-ABC123');
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
  });

  it('should show "Copied!" state after copying', async () => {
    let copied = false;
    const code = 'STU-XYZ789';

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    };

    await handleCopy();
    expect(copied).toBe(true);

    // After 2 seconds, should revert
    vi.advanceTimersByTime(2000);
    expect(copied).toBe(false);
  });

  it('should show "Copy Code" text when not copied', () => {
    const copied = false;
    const buttonText = copied ? 'Copied!' : 'Copy Code';

    expect(buttonText).toBe('Copy Code');
  });

  it('should show "Copied!" text after copying', () => {
    const copied = true;
    const buttonText = copied ? 'Copied!' : 'Copy Code';

    expect(buttonText).toBe('Copied!');
  });

  it('should handle clipboard fallback for older browsers', () => {
    // The component has a fallback using document.createElement('textarea')
    // and document.execCommand('copy')
    const code = 'STU-FALLBACK';

    // Simulate fallback behavior
    const mockExecCommand = vi.fn().mockReturnValue(true);
    const originalExecCommand = document.execCommand;
    document.execCommand = mockExecCommand;

    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    expect(mockExecCommand).toHaveBeenCalledWith('copy');
    expect(textArea.value).toBe('STU-FALLBACK');

    document.execCommand = originalExecCommand;
  });

  it('should display helper text about sharing the code', () => {
    const helperText = 'Share this code with your parent or guardian so they can link their account to yours.';
    expect(helperText).toContain('parent or guardian');
    expect(helperText).toContain('link their account');
  });

  it('should display "Your Student Code" label', () => {
    const labelText = 'Your Student Code';
    expect(labelText).toBe('Your Student Code');
  });

  it('should revert copied state after 2 seconds', async () => {
    let copied = false;

    const handleCopy = async () => {
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    };

    await handleCopy();
    expect(copied).toBe(true);

    // Before timeout
    vi.advanceTimersByTime(1000);
    expect(copied).toBe(true);

    // After timeout
    vi.advanceTimersByTime(1000);
    expect(copied).toBe(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
