'use client';

interface LongAnswerInputProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function LongAnswerInput({
  value,
  onChange,
  disabled = false,
}: LongAnswerInputProps) {
  const text = value || '';
  const wordCount = countWords(text);

  return (
    <div className="space-y-1.5">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Write your detailed answer here..."
        rows={8}
        className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>
    </div>
  );
}
