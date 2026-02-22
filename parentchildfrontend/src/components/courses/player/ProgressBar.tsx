'use client';

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground shrink-0">
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
