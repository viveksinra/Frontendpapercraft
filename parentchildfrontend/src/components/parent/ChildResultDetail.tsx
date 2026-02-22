'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getChildResultDetail } from '@/lib/parent-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Target,
  Clock,
  FileText,
} from 'lucide-react';

interface ChildResultDetailProps {
  childId: string;
  testId: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getScoreColor(score?: number) {
  if (score === undefined || score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function ChildResultDetail({ childId, testId }: ChildResultDetailProps) {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChildResultDetail(childId, testId);
        setResult(data.result || data);
      } catch (err: any) {
        setError(err.message || 'Failed to load result details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [childId, testId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!result) return null;

  const testName = result.testName || result.test?.name || 'Test Result';
  const score = result.score ?? result.percentage;
  const grade = result.grade;
  const date = result.completedAt || result.date;
  const timeTaken = result.timeTaken || result.durationMinutes;
  const totalQuestions = result.totalQuestions || result.questions?.length || 0;
  const correctAnswers = result.correctAnswers ?? result.correct;
  const questions = result.questions || [];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Results
      </Button>

      {/* Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{testName}</CardTitle>
          {date && (
            <CardDescription>Completed {formatDate(date)}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p
                  className={cn(
                    'text-lg font-bold',
                    getScoreColor(typeof score === 'number' ? score : undefined)
                  )}
                >
                  {score !== undefined && score !== null
                    ? typeof score === 'number'
                      ? `${Math.round(score)}%`
                      : score
                    : '--'}
                </p>
              </div>
            </div>

            {grade && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="text-lg font-bold">{grade}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Correct</p>
                <p className="text-lg font-bold">
                  {correctAnswers !== undefined
                    ? `${correctAnswers}/${totalQuestions}`
                    : `${totalQuestions} Q`}
                </p>
              </div>
            </div>

            {timeTaken && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-lg font-bold">
                    {typeof timeTaken === 'number' ? `${timeTaken} min` : timeTaken}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Question Review</h3>
          {questions.map((q: any, index: number) => {
            const isCorrect = q.isCorrect ?? q.correct;
            const questionText = q.question || q.text || q.questionText || `Question ${index + 1}`;
            const selectedAnswer = q.selectedAnswer || q.answer || q.studentAnswer;
            const correctAnswer = q.correctAnswer || q.expectedAnswer;
            const explanation = q.explanation;

            return (
              <Card
                key={q.id || index}
                className={cn(
                  'border-l-4',
                  isCorrect
                    ? 'border-l-green-500'
                    : 'border-l-red-500'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">Q{index + 1}.</span>{' '}
                        {questionText}
                      </p>
                      {selectedAnswer && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Your answer: </span>
                          <span
                            className={cn(
                              'font-medium',
                              isCorrect ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {selectedAnswer}
                          </span>
                        </p>
                      )}
                      {!isCorrect && correctAnswer && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">
                            Correct answer:{' '}
                          </span>
                          <span className="font-medium text-green-600">
                            {correctAnswer}
                          </span>
                        </p>
                      )}
                      {explanation && (
                        <>
                          <Separator />
                          <p className="text-xs text-muted-foreground">
                            {explanation}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
