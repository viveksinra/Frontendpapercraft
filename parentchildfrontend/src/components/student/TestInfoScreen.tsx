'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTests } from '@/lib/student-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  FileText,
  CalendarDays,
  Loader2,
  Play,
  ArrowLeft,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface TestInfoScreenProps {
  testId: string;
}

export function TestInfoScreen({ testId }: TestInfoScreenProps) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getTests({ page: 1, pageSize: 100 });
        const found = (res.tests || []).find((t: any) => t._id === testId);
        if (found) {
          setTest(found);
        } else {
          setError('Test not found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load test details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error || 'Test not found'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Not scheduled';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Tests
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{test.title}</CardTitle>
          {test.description && (
            <p className="text-sm text-muted-foreground">{test.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{test.totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{test.scheduling?.duration} min</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formatDate(test.scheduling?.startTime)}</p>
                <p className="text-xs text-muted-foreground">Start Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{test.totalMarks} marks</p>
                <p className="text-xs text-muted-foreground">Total Marks</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-semibold">Instructions</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>- Ensure a stable internet connection before starting.</li>
              <li>- Once started, the timer cannot be paused.</li>
              <li>- Your answers are auto-saved periodically.</li>
              <li>- You can flag questions for review before submitting.</li>
              {test.mode === 'section_timed' && (
                <li>- This test has timed sections. You cannot go back to previous sections.</li>
              )}
              {test.options?.maxAttempts > 1 && (
                <li>- You have up to {test.options.maxAttempts} attempts.</li>
              )}
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push(`/student/take-test/${test._id}`)}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
