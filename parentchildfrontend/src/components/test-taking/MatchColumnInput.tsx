'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MatchColumnInputProps {
  leftItems: string[];
  rightItems: string[];
  value: Record<string, string> | null;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export function MatchColumnInput({
  leftItems,
  rightItems,
  value,
  onChange,
  disabled = false,
}: MatchColumnInputProps) {
  const matches = value || {};

  const handleMatch = (leftItem: string, rightItem: string) => {
    onChange({ ...matches, [leftItem]: rightItem });
  };

  return (
    <div className="space-y-3">
      {/* Desktop header row */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Column A</span>
        <span />
        <span>Column B</span>
      </div>
      {leftItems.map((left, index) => (
        <div
          key={left}
          className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3"
        >
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2.5 text-sm">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span>{left}</span>
          </div>
          <span className="hidden text-muted-foreground sm:inline">→</span>
          <Select
            value={matches[left] || ''}
            onValueChange={(val) => handleMatch(left, val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full min-h-[44px] sm:min-h-0">
              <SelectValue placeholder="Select match..." />
            </SelectTrigger>
            <SelectContent>
              {rightItems.map((right) => (
                <SelectItem key={right} value={right}>
                  {right}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
