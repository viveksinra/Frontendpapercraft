'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface McqOption {
  _id: string;
  text: string;
}

interface McqAnswerInputProps {
  options: McqOption[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  /** If true, allows selecting multiple options */
  multiSelect?: boolean;
  disabled?: boolean;
}

export function McqAnswerInput({
  options,
  value,
  onChange,
  multiSelect = false,
  disabled = false,
}: McqAnswerInputProps) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionId: string) => {
    if (disabled) return;

    if (multiSelect) {
      const next = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];
      onChange(next);
    } else {
      onChange(optionId);
    }
  };

  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selected.includes(option._id);
        return (
          <button
            key={option._id}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(option._id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border-2 p-3 sm:p-3 p-3.5 text-left transition-all min-h-[48px] sm:min-h-0',
              isSelected
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/40 hover:bg-accent',
              disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground'
              )}
            >
              {isSelected ? <Check className="h-4 w-4" /> : labels[index] || index + 1}
            </span>
            <span className="text-sm">{option.text}</span>
          </button>
        );
      })}
    </div>
  );
}
