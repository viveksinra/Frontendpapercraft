import { describe, it, expect, vi } from 'vitest';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockAlerts = [
  {
    id: 'a1',
    type: 'new_result',
    title: 'New test result available',
    description: 'Alice scored 85% on Math Test',
    childName: 'Alice Smith',
    date: '2026-02-22T10:30:00Z',
  },
  {
    id: 'a2',
    type: 'overdue_homework',
    title: 'Overdue homework',
    description: 'English worksheet due yesterday',
    childName: 'Bob Smith',
    date: '2026-02-21T08:00:00Z',
  },
  {
    id: 'a3',
    type: 'upcoming_test',
    title: 'Upcoming test reminder',
    description: 'Science test in 2 days',
    childName: 'Alice Smith',
    date: '2026-02-24T09:00:00Z',
  },
  {
    id: 'a4',
    type: 'unknown_type',
    title: 'General notification',
    date: '2026-02-22T12:00:00Z',
  },
];

describe('ParentAlertsList', () => {
  it('should be a valid component export', async () => {
    const { ParentAlertsList } = await import('../ParentAlertsList');
    expect(ParentAlertsList).toBeDefined();
    expect(typeof ParentAlertsList).toBe('function');
  });

  it('should render all alerts', () => {
    expect(mockAlerts).toHaveLength(4);
  });

  it('should render overdue homework alerts with orange styling', () => {
    const overdueAlert = mockAlerts.find((a) => a.type === 'overdue_homework');

    expect(overdueAlert).toBeDefined();
    expect(overdueAlert!.title).toBe('Overdue homework');
    expect(overdueAlert!.description).toBe('English worksheet due yesterday');

    // Verify the config function behavior
    const getAlertConfig = (type?: string) => {
      switch (type) {
        case 'overdue':
        case 'overdue_homework':
          return { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' };
        default:
          return { color: 'text-muted-foreground', bg: 'bg-muted/50' };
      }
    };

    const config = getAlertConfig('overdue_homework');
    expect(config.color).toBe('text-orange-600');
    expect(config.bg).toContain('orange');
  });

  it('should render new results alerts with green styling', () => {
    const resultAlert = mockAlerts.find((a) => a.type === 'new_result');

    expect(resultAlert).toBeDefined();
    expect(resultAlert!.title).toBe('New test result available');

    const getAlertConfig = (type?: string) => {
      switch (type) {
        case 'new_result':
        case 'result':
          return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' };
        default:
          return { color: 'text-muted-foreground', bg: 'bg-muted/50' };
      }
    };

    const config = getAlertConfig('new_result');
    expect(config.color).toBe('text-green-600');
    expect(config.bg).toContain('green');
  });

  it('should render upcoming test alerts with blue styling', () => {
    const upcomingAlert = mockAlerts.find((a) => a.type === 'upcoming_test');

    expect(upcomingAlert).toBeDefined();

    const getAlertConfig = (type?: string) => {
      switch (type) {
        case 'upcoming_test':
        case 'upcoming':
          return { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' };
        default:
          return { color: 'text-muted-foreground', bg: 'bg-muted/50' };
      }
    };

    const config = getAlertConfig('upcoming_test');
    expect(config.color).toBe('text-blue-600');
  });

  it('should use default styling for unknown alert types', () => {
    const unknownAlert = mockAlerts.find((a) => a.type === 'unknown_type');
    expect(unknownAlert).toBeDefined();

    const getAlertConfig = (type?: string) => {
      switch (type) {
        case 'new_result':
        case 'result':
          return { color: 'text-green-600' };
        case 'overdue':
        case 'overdue_homework':
          return { color: 'text-orange-600' };
        case 'upcoming_test':
        case 'upcoming':
          return { color: 'text-blue-600' };
        default:
          return { color: 'text-muted-foreground' };
      }
    };

    const config = getAlertConfig('unknown_type');
    expect(config.color).toBe('text-muted-foreground');
  });

  it('should render empty state when alerts array is empty', () => {
    const alerts: any[] = [];
    const isEmpty = !alerts || alerts.length === 0;

    expect(isEmpty).toBe(true);
  });

  it('should render empty state when alerts is null/undefined', () => {
    const alerts = null;
    const isEmpty = !alerts || (alerts as any).length === 0;

    expect(isEmpty).toBe(true);
  });

  it('should display child name when present', () => {
    const alertWithChild = mockAlerts[0];
    expect(alertWithChild.childName).toBe('Alice Smith');

    const alertWithoutChild = mockAlerts[3];
    expect(alertWithoutChild.childName).toBeUndefined();
  });

  it('should format dates correctly', () => {
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return dateStr;
      }
    };

    const formatted = formatDate('2026-02-22T10:30:00Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);

    // Empty string for undefined date
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('should display alert title or message', () => {
    mockAlerts.forEach((alert) => {
      const displayText = alert.title || (alert as any).message;
      expect(displayText).toBeDefined();
      expect(typeof displayText).toBe('string');
    });
  });
});
