'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getChildResults } from '@/lib/parent-api';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Loader2,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
} from 'lucide-react';

interface ChildResultsListProps {
  childId: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getTrendIcon(trend?: string) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function getScoreColor(score?: number) {
  if (score === undefined || score === null) return '';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function ChildResultsList({ childId }: ChildResultsListProps) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChildResults(childId);
      setResults(data.results || data.items || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load results.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchResults}>
          Try Again
        </Button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No results available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result: any) => {
        const testName = result.testName || result.test?.name || 'Test';
        const score = result.score ?? result.percentage;
        const grade = result.grade;
        const date = result.completedAt || result.date;
        const trend = result.trend;
        const testId = result.testId || result.test?.id || result.id;
        const subject = result.subject || result.test?.subject;
        const totalQuestions = result.totalQuestions;
        const correctAnswers = result.correctAnswers;

        return (
          <Link key={testId} href={`/children/${childId}/results/${testId}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{testName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {subject && <span>{subject}</span>}
                    {date && (
                      <>
                        {subject && <span>&middot;</span>}
                        <span>{formatDate(date)}</span>
                      </>
                    )}
                    {correctAnswers !== undefined && totalQuestions && (
                      <>
                        <span>&middot;</span>
                        <span>
                          {correctAnswers}/{totalQuestions} correct
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  {score !== undefined && score !== null && (
                    <span
                      className={cn(
                        'text-lg font-bold',
                        getScoreColor(typeof score === 'number' ? score : undefined)
                      )}
                    >
                      {typeof score === 'number' ? `${Math.round(score)}%` : score}
                    </span>
                  )}
                  {grade && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                      {grade}
                    </span>
                  )}
                  {getTrendIcon(trend)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
