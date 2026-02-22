'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChildHomeworkDetail } from '@/lib/parent-api';

interface HomeworkDetailData {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  status: string;
  totalMarks: number;
  submission: {
    status: string;
    score: number | null;
    totalMarks: number;
    percentage: number | null;
    feedback: string;
    submittedAt: string | null;
  } | null;
}

export function ChildHomeworkDetail({ childId, homeworkId }: { childId: string; homeworkId: string }) {
  const router = useRouter();
  const [data, setData] = useState<HomeworkDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getChildHomeworkDetail(childId, homeworkId);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load homework details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId, homeworkId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error || 'Homework not found'}
        </div>
      </div>
    );
  }

  const sub = data.submission;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{data.title}</h1>
          <p className="text-sm text-muted-foreground">
            {data.type === 'test' ? 'Test-based' : 'Question-based'} homework
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          {data.description && <p className="text-sm">{data.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Due {new Date(data.dueDate).toLocaleDateString('en-GB')}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {data.totalMarks} marks
            </span>
          </div>
        </CardContent>
      </Card>

      {sub && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium capitalize">{sub.status}</span>
            </div>
            {sub.score != null && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Score:</span>
                <span className="text-lg font-bold tabular-nums">
                  {sub.score}/{sub.totalMarks}
                  {sub.percentage != null && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({sub.percentage.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
            )}
            {sub.feedback && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Feedback:</span>
                <p className="rounded-md bg-muted p-3 text-sm">{sub.feedback}</p>
              </div>
            )}
            {sub.submittedAt && (
              <div className="text-xs text-muted-foreground">
                Submitted: {new Date(sub.submittedAt).toLocaleString('en-GB')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!sub && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No submission yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
