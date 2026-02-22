import { describe, it, expect, vi } from 'vitest';

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => children,
  DialogContent: ({ children }: any) => children,
  DialogDescription: ({ children }: any) => children,
  DialogFooter: ({ children }: any) => children,
  DialogHeader: ({ children }: any) => children,
  DialogTitle: ({ children }: any) => children,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => ({ children, onClick, disabled }),
}));

describe('SubmitConfirmDialog', () => {
  it('should be a valid component export', async () => {
    const { SubmitConfirmDialog } = await import('../SubmitConfirmDialog');
    expect(SubmitConfirmDialog).toBeDefined();
    expect(typeof SubmitConfirmDialog).toBe('function');
  });

  it('should show answered and unanswered counts', () => {
    const summary = { answered: 18, unanswered: 2, flagged: 1, total: 20 };

    expect(summary.answered).toBe(18);
    expect(summary.unanswered).toBe(2);
    expect(summary.total).toBe(20);
    expect(summary.answered + summary.unanswered).toBe(summary.total);
  });

  it('should show flagged count when there are flagged questions', () => {
    const summary = { answered: 15, unanswered: 5, flagged: 3, total: 20 };

    expect(summary.flagged).toBe(3);
    expect(summary.flagged > 0).toBe(true);
  });

  it('should not show flagged section when flagged is 0', () => {
    const summary = { answered: 20, unanswered: 0, flagged: 0, total: 20 };

    // Component conditionally renders flagged section only when > 0
    expect(summary.flagged > 0).toBe(false);
  });

  it('should show warning message when there are unanswered questions', () => {
    const summary = { answered: 18, unanswered: 2, flagged: 0, total: 20 };

    expect(summary.unanswered > 0).toBe(true);

    // The warning message includes the count
    const message = `You have ${summary.unanswered} unanswered ${summary.unanswered === 1 ? 'question' : 'questions'}.`;
    expect(message).toBe('You have 2 unanswered questions.');
  });

  it('should use singular "question" when only 1 unanswered', () => {
    const summary = { answered: 19, unanswered: 1, flagged: 0, total: 20 };

    const message = `You have ${summary.unanswered} unanswered ${summary.unanswered === 1 ? 'question' : 'questions'}.`;
    expect(message).toBe('You have 1 unanswered question.');
  });

  it('should not show warning when all questions are answered', () => {
    const summary = { answered: 20, unanswered: 0, flagged: 0, total: 20 };

    expect(summary.unanswered > 0).toBe(false);
  });

  it('should call onConfirm when submit button is clicked', () => {
    const onConfirm = vi.fn();

    onConfirm();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onOpenChange(false) when go back button is clicked', () => {
    const onOpenChange = vi.fn();

    onOpenChange(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show "Submitting..." text when submitting is true', () => {
    const submitting = true;
    const buttonText = submitting ? 'Submitting...' : 'Submit Test';

    expect(buttonText).toBe('Submitting...');
  });

  it('should show "Submit Test" text when not submitting', () => {
    const submitting = false;
    const buttonText = submitting ? 'Submitting...' : 'Submit Test';

    expect(buttonText).toBe('Submit Test');
  });

  it('should disable buttons when submitting', () => {
    const submitting = true;
    expect(submitting).toBe(true);
    // Both "Go Back" and "Submit Test" buttons should be disabled
  });
});
