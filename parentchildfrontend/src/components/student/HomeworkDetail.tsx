'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStudentHomeworkDetail, submitHomework } from '@/lib/student-homework-api';

interface HomeworkDetailData {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  status: string;
  totalMarks: number;
  lateSubmissionAllowed: boolean;
  lateDeadline: string | null;
  submission: {
    status: string;
    score: number | null;
    totalMarks: number;
    percentage: number | null;
    feedback: string;
    submittedAt: string | null;
    gradedAt: string | null;
    answers: Array<{
      questionId: string;
      answer: unknown;
      isCorrect: boolean | null;
      marksAwarded: number;
      maxMarks: number;
    }>;
  } | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'graded': return 'text-green-600 dark:text-green-400';
    case 'submitted': return 'text-blue-600 dark:text-blue-400';
    case 'late': return 'text-orange-600 dark:text-orange-400';
    case 'pending': return 'text-yellow-600 dark:text-yellow-400';
    default: return 'text-muted-foreground';
  }
}

export function HomeworkDetail({ homeworkId }: { homeworkId: string }) {
  const router = useRouter();
  const [data, setData] = useState<HomeworkDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getStudentHomeworkDetail(homeworkId);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load homework details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [homeworkId]);

  async function handleSubmit() {
    if (!data) return;
    try {
      setSubmitting(true);
      await submitHomework(homeworkId, []);
      const res = await getStudentHomeworkDetail(homeworkId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit homework');
    } finally {
      setSubmitting(false);
    }
  }

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
  const canSubmit = !sub || sub.status === 'pending';
  const isOverdue = new Date(data.dueDate).getTime() < Date.now();
  const effectiveDeadline = data.lateSubmissionAllowed && data.lateDeadline
    ? new Date(data.lateDeadline)
    : new Date(data.dueDate);
  const canStillSubmit = canSubmit && effectiveDeadline.getTime() > Date.now();

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

      {/* Details card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {data.description && (
            <p className="text-sm">{data.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Due {new Date(data.dueDate).toLocaleDateString('en-GB')}
              {isOverdue && !data.lateSubmissionAllowed && (
                <span className="text-red-500 font-medium">(Overdue)</span>
              )}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              {data.totalMarks} marks
            </span>
            {data.lateSubmissionAllowed && data.lateDeadline && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Late deadline: {new Date(data.lateDeadline).toLocaleDateString('en-GB')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submission status */}
      {sub && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`text-sm font-medium capitalize ${getStatusColor(sub.status)}`}>
                {sub.status}
              </span>
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

      {/* Submit button */}
      {canStillSubmit && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Homework'}
          </Button>
        </div>
      )}
    </div>
  );
}
