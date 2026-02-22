'use client';

import { Check, Loader2, AlertCircle, Minus } from 'lucide-react';
import type { AutoSaveStatus } from '@/hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
}

const indicators: Record<AutoSaveStatus, { icon: React.ReactNode; text: string; className: string }> = {
  idle: {
    icon: <Minus className="h-3 w-3" />,
    text: '',
    className: 'text-muted-foreground',
  },
  saving: {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    text: 'Saving...',
    className: 'text-muted-foreground',
  },
  saved: {
    icon: <Check className="h-3 w-3" />,
    text: 'Saved',
    className: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: <AlertCircle className="h-3 w-3" />,
    text: 'Save failed',
    className: 'text-destructive',
  },
};

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  if (status === 'idle') return null;

  const indicator = indicators[status];
  return (
    <div className={`flex items-center gap-1.5 text-xs ${indicator.className}`}>
      {indicator.icon}
      <span>{indicator.text}</span>
    </div>
  );
}
