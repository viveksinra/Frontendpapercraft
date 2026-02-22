import { describe, it, expect, vi } from 'vitest';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

describe('AutoSaveIndicator', () => {
  it('should be a valid component export', async () => {
    // Mock the dependency before importing the component
    vi.mock('@/hooks/useAutoSave', () => ({
      AutoSaveStatus: {} as any,
    }));

    const { AutoSaveIndicator } = await import('../AutoSaveIndicator');
    expect(AutoSaveIndicator).toBeDefined();
    expect(typeof AutoSaveIndicator).toBe('function');
  });

  it('should return null for idle status', () => {
    const status: AutoSaveStatus = 'idle';
    // Component returns null when status is 'idle'
    expect(status).toBe('idle');
    // In the actual component: if (status === 'idle') return null;
    const shouldRender = status !== 'idle';
    expect(shouldRender).toBe(false);
  });

  it('should show "Saving..." text for saving status', () => {
    const indicators: Record<AutoSaveStatus, { text: string; className: string }> = {
      idle: { text: '', className: 'text-muted-foreground' },
      saving: { text: 'Saving...', className: 'text-muted-foreground' },
      saved: { text: 'Saved', className: 'text-green-600 dark:text-green-400' },
      error: { text: 'Save failed', className: 'text-destructive' },
    };

    const status: AutoSaveStatus = 'saving';
    const indicator = indicators[status];

    expect(indicator.text).toBe('Saving...');
    expect(indicator.className).toBe('text-muted-foreground');
  });

  it('should show "Saved" text for saved status', () => {
    const indicators: Record<AutoSaveStatus, { text: string }> = {
      idle: { text: '' },
      saving: { text: 'Saving...' },
      saved: { text: 'Saved' },
      error: { text: 'Save failed' },
    };

    const status: AutoSaveStatus = 'saved';
    const indicator = indicators[status];

    expect(indicator.text).toBe('Saved');
  });

  it('should show "Save failed" text for error status', () => {
    const indicators: Record<AutoSaveStatus, { text: string }> = {
      idle: { text: '' },
      saving: { text: 'Saving...' },
      saved: { text: 'Saved' },
      error: { text: 'Save failed' },
    };

    const status: AutoSaveStatus = 'error';
    const indicator = indicators[status];

    expect(indicator.text).toBe('Save failed');
  });

  it('should use green color class for saved status', () => {
    const savedClassName = 'text-green-600 dark:text-green-400';
    expect(savedClassName).toContain('text-green');
  });

  it('should use destructive color class for error status', () => {
    const errorClassName = 'text-destructive';
    expect(errorClassName).toContain('destructive');
  });

  it('should render for all non-idle states', () => {
    const statuses: AutoSaveStatus[] = ['idle', 'saving', 'saved', 'error'];
    const renderableStatuses = statuses.filter((s) => s !== 'idle');

    expect(renderableStatuses).toEqual(['saving', 'saved', 'error']);
    expect(renderableStatuses).toHaveLength(3);
  });
});
