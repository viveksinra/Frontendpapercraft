'use client';

interface ShortAnswerInputProps {
  value: string | null;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

export function ShortAnswerInput({
  value,
  onChange,
  maxLength = 500,
  disabled = false,
}: ShortAnswerInputProps) {
  const text = value || '';
  const charCount = text.length;

  return (
    <div className="space-y-1.5">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        placeholder="Type your answer here..."
        rows={3}
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {charCount} / {maxLength} characters
        </span>
      </div>
    </div>
  );
}
