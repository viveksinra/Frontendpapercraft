'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Award } from 'lucide-react';

interface ResultCardProps {
  result: {
    testId: string;
    testTitle: string;
    percentage: number;
    grade: string;
    rank?: number | null;
    totalStudents?: number | null;
    marksObtained: number;
    totalMarks: number;
    submittedAt: string;
    mode?: string;
  };
}

function getScoreColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getGradeColor(grade: string): string {
  const g = grade.toUpperCase();
  if (g === 'A+' || g === 'A*' || g === 'A') return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
  if (g === 'B') return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  if (g === 'C') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
}

export function ResultCard({ result }: ResultCardProps) {
  const formattedDate = new Date(result.submittedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/student/tests/${result.testId}/result`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">{result.testTitle}</h3>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {formattedDate}
                </span>
                <span>
                  {result.marksObtained}/{result.totalMarks} marks
                </span>
                {result.rank != null && (
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Rank #{result.rank}
                    {result.totalStudents ? ` of ${result.totalStudents}` : ''}
                  </span>
                )}
              </div>

              {/* Score bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${getScoreColor(result.percentage)}`}
                  style={{ width: `${Math.min(100, result.percentage)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </span>
              <span className="text-lg font-bold tabular-nums">{result.percentage.toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
