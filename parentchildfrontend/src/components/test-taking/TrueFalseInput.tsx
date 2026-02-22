'use client';

import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface TrueFalseInputProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function TrueFalseInput({ value, onChange, disabled = false }: TrueFalseInputProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm font-semibold transition-all',
          value === true
            ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
            : 'border-border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/30',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <Check className="h-5 w-5" />
        True
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm font-semibold transition-all',
          value === false
            ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'border-border hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/30',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <X className="h-5 w-5" />
        False
      </button>
    </div>
  );
}
