'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Play, Eye, CalendarDays } from 'lucide-react';

interface TestCardProps {
  test: {
    _id: string;
    title: string;
    description?: string;
    mode: string;
    status: string;
    scheduling: { startTime: string | null; endTime: string | null; duration: number };
    totalQuestions: number;
    totalMarks: number;
    attemptStatus?: string;
  };
}

function getModeBadge(mode: string) {
  const badges: Record<string, { label: string; className: string }> = {
    live_mock: { label: 'Live Mock', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
    anytime_mock: { label: 'Mock Test', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    practice: { label: 'Practice', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
    classroom: { label: 'Classroom', className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    section_timed: { label: 'Section Timed', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  };
  return badges[mode] || { label: mode, className: 'bg-muted text-muted-foreground' };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Anytime';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TestCard({ test }: TestCardProps) {
  const badge = getModeBadge(test.mode);
  const isCompleted = test.attemptStatus === 'submitted' || test.attemptStatus === 'graded';
  const isInProgress = test.attemptStatus === 'in_progress';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                {badge.label}
              </span>
              {isInProgress && (
                <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                  In Progress
                </span>
              )}
            </div>

            <h3 className="truncate text-sm font-semibold">{test.title}</h3>

            {test.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {test.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {test.totalQuestions} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {test.scheduling.duration} min
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formatDate(test.scheduling.startTime)}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isCompleted ? (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/student/tests/${test._id}/result`}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Results
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={`/student/tests/${test._id}`}>
                  <Play className="mr-1 h-3.5 w-3.5" />
                  {isInProgress ? 'Resume' : 'View'}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
