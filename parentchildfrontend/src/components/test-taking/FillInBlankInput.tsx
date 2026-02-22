'use client';

import { Input } from '@/components/ui/input';

interface FillInBlankInputProps {
  /** Number of blanks expected */
  blankCount?: number;
  value: string[] | null;
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function FillInBlankInput({
  blankCount = 1,
  value,
  onChange,
  disabled = false,
}: FillInBlankInputProps) {
  const answers = value || Array(blankCount).fill('');

  const handleChange = (index: number, text: string) => {
    const next = [...answers];
    // Ensure array is large enough
    while (next.length <= index) next.push('');
    next[index] = text;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: blankCount }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            {i + 1}
          </span>
          <Input
            value={answers[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Answer ${i + 1}`}
            disabled={disabled}
            className="max-w-md"
          />
        </div>
      ))}
    </div>
  );
}
