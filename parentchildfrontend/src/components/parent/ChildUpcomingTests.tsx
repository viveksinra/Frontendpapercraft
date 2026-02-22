'use client';

import { Calendar, Clock } from 'lucide-react';

interface ChildUpcomingTestsProps {
  tests: any[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getCountdown(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const now = new Date();
    const target = new Date(dateStr);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs < 0) return 'Overdue';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  } catch {
    return '';
  }
}

export function ChildUpcomingTests({ tests }: ChildUpcomingTestsProps) {
  if (!tests || tests.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No upcoming tests scheduled.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tests.map((test: any, index: number) => {
        const name = test.name || test.testName || 'Test';
        const date = test.scheduledDate || test.startDate || test.date;
        const countdown = getCountdown(date);

        return (
          <div
            key={test.id || index}
            className="flex items-center justify-between rounded-md border px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
              </div>
            </div>
            {countdown && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Clock className="h-3 w-3" />
                {countdown}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
