'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CalendarDays, ArrowRight } from 'lucide-react';

interface UpcomingTest {
  _id: string;
  title: string;
  mode: string;
  scheduling: { startTime: string | null; duration: number };
  totalQuestions: number;
}

interface UpcomingTestsListProps {
  tests: UpcomingTest[];
}

function getCountdown(startTime: string | null): string {
  if (!startTime) return 'Anytime';
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return 'Starting now';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function UpcomingTestsList({ tests }: UpcomingTestsListProps) {
  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />
            Upcoming Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No upcoming tests scheduled. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4" />
          Upcoming Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tests.slice(0, 5).map((test) => (
          <Link
            key={test._id}
            href={`/student/tests/${test._id}`}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{test.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{test.totalQuestions} questions</span>
                <span>{test.scheduling.duration} min</span>
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <Clock className="h-3 w-3" />
                {getCountdown(test.scheduling.startTime)}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}

        {tests.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/student/tests">View all tests</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
