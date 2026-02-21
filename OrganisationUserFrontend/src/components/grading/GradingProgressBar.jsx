'use client';

export default function GradingProgressBar({ graded = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((graded / total) * 100) : 0;
  const isComplete = graded >= total && total > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {graded}/{total} graded
        </span>
        <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
