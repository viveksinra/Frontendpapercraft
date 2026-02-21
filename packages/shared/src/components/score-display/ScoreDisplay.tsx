import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ScoreDisplayProps {
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number | null;
  percentile?: number | null;
  totalStudents?: number | null;
  className?: string;
}

// ─── Grade colour helpers ───────────────────────────────────────────────────

function getGradeColor(grade: string): string {
  const g = grade.toUpperCase();
  if (g === "A+" || g === "A*") return "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
  if (g === "A") return "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800";
  if (g === "B") return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
  if (g === "C") return "bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
  if (g === "D") return "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
  if (g === "E") return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/80 dark:text-orange-400 dark:border-orange-800";
  if (g === "F" || g === "U") return "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
  // Default
  return "bg-muted text-muted-foreground border-border";
}

function getPercentageColor(pct: number): string {
  if (pct >= 80) return "text-green-600 dark:text-green-400";
  if (pct >= 60) return "text-blue-600 dark:text-blue-400";
  if (pct >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getPercentileBarColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-blue-500";
  if (pct >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ScoreDisplay({
  marksObtained,
  totalMarks,
  percentage,
  grade,
  rank,
  percentile,
  totalStudents,
  className = "",
}: ScoreDisplayProps) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Score card */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Score
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums">{marksObtained}</span>
          <span className="text-lg text-muted-foreground">/ {totalMarks}</span>
        </div>
      </div>

      {/* Percentage */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Percentage
        </span>
        <span className={`text-2xl font-bold tabular-nums ${getPercentageColor(percentage)}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Grade badge */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Grade
        </span>
        <span
          className={`inline-flex items-center justify-center rounded-full border px-4 py-1 text-lg font-bold ${getGradeColor(grade)}`}
        >
          {grade}
        </span>
      </div>

      {/* Rank */}
      {rank != null && totalStudents != null && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Rank
          </span>
          <span className="text-lg font-semibold tabular-nums">
            #{rank}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {totalStudents}
            </span>
          </span>
        </div>
      )}

      {/* Percentile bar */}
      {percentile != null && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Percentile
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {percentile.toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getPercentileBarColor(percentile)}`}
              style={{ width: `${Math.min(100, Math.max(0, percentile))}%` }}
              role="progressbar"
              aria-valuenow={percentile}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${percentile.toFixed(1)} percentile`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreDisplay;
