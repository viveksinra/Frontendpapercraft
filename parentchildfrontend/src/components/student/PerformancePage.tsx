'use client';

import { useEffect, useState } from 'react';
import { getPerformance } from '@/lib/student-api';
import { ScoreTrendChart } from './ScoreTrendChart';
import { SubjectRadarChart } from './SubjectRadarChart';
import { DifficultyAnalysisChart } from './DifficultyAnalysisChart';
import { TimeAnalysisSection } from './TimeAnalysisSection';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PerformanceData {
  scoreTrend: { date: string; score: number; testTitle?: string }[];
  subjectBreakdown: { subject: string; percentage: number }[];
  difficultyAnalysis: { difficulty: string; correct: number; total: number; percentage: number }[];
  timeAnalysis: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
    totalTimeSpent: number;
    questionsWithinTarget?: number;
    totalQuestions?: number;
  };
}

export function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPerformance();
        setData(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="mt-1 text-muted-foreground">Track your progress and identify areas for improvement</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        <p className="mt-1 text-muted-foreground">Track your progress and identify areas for improvement</p>
      </div>

      <ScoreTrendChart data={data.scoreTrend || []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SubjectRadarChart data={data.subjectBreakdown || []} />
        <DifficultyAnalysisChart data={data.difficultyAnalysis || []} />
      </div>

      {data.timeAnalysis && <TimeAnalysisSection data={data.timeAnalysis} />}
    </div>
  );
}
