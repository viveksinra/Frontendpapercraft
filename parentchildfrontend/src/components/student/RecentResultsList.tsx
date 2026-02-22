'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';

interface RecentResult {
  testId: string;
  testTitle: string;
  percentage: number;
  grade: string;
  trend?: 'up' | 'down' | 'same';
  submittedAt: string;
}

interface RecentResultsListProps {
  results: RecentResult[];
}

function getScoreColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function TrendIcon({ trend }: { trend?: string }) {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function RecentResultsList({ results }: RecentResultsListProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Recent Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No results yet. Complete a test to see your scores here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4" />
          Recent Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.slice(0, 5).map((result) => (
          <Link
            key={result.testId}
            href={`/student/tests/${result.testId}/result`}
            className="block rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <p className="truncate text-sm font-medium">{result.testTitle}</p>
              <div className="ml-2 flex items-center gap-1.5">
                <TrendIcon trend={result.trend} />
                <span className="text-sm font-bold tabular-nums">
                  {result.percentage.toFixed(0)}%
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
                  {result.grade}
                </span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${getScoreColor(result.percentage)}`}
                style={{ width: `${Math.min(100, result.percentage)}%` }}
              />
            </div>
          </Link>
        ))}

        {results.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/student/results">View all results</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
