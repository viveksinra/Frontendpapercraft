'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChildRecentResultsProps {
  results: any[];
  childId?: string;
}

function getTrendIcon(trend?: string) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function getGradeColor(grade?: string) {
  if (!grade) return 'text-muted-foreground';
  const g = grade.toUpperCase();
  if (g === 'A' || g === 'A*' || g === 'A+') return 'text-green-600';
  if (g === 'B' || g === 'B+') return 'text-blue-600';
  if (g === 'C' || g === 'C+') return 'text-yellow-600';
  return 'text-orange-600';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

export function ChildRecentResults({ results, childId }: ChildRecentResultsProps) {
  if (!results || results.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No recent results available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result: any, index: number) => {
        const testName = result.testName || result.test?.name || 'Test';
        const score = result.score ?? result.percentage;
        const grade = result.grade;
        const date = result.completedAt || result.date;
        const trend = result.trend;
        const testId = result.testId || result.test?.id;

        const content = (
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{testName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
            </div>
            <div className="flex items-center gap-3">
              {score !== undefined && score !== null && (
                <span className="text-sm font-semibold">
                  {typeof score === 'number' ? `${Math.round(score)}%` : score}
                </span>
              )}
              {grade && (
                <span className={cn('text-sm font-bold', getGradeColor(grade))}>
                  {grade}
                </span>
              )}
              {getTrendIcon(trend)}
            </div>
          </div>
        );

        if (childId && testId) {
          return (
            <Link
              key={testId || index}
              href={`/children/${childId}/results/${testId}`}
            >
              {content}
            </Link>
          );
        }

        return <div key={testId || index}>{content}</div>;
      })}
    </div>
  );
}
