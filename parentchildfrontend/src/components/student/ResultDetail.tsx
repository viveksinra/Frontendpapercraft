'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getResultDetail } from '@/lib/student-api';
import { ScoreRevealAnimation } from './ScoreRevealAnimation';
import { SectionBreakdown } from './SectionBreakdown';
import { QuestionReviewList } from './QuestionReviewList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { ScoreDisplay } from '@papercraft/shared';

interface ResultDetailProps {
  testId: string;
  attemptNumber?: number;
}

export function ResultDetail({ testId, attemptNumber }: ResultDetailProps) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getResultDetail(testId, attemptNumber);
        setData(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load result');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testId, attemptNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error || 'Result not found'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const result = data.result || data;
  const questions = data.questionBreakdown || data.questions || [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Results
      </Button>

      <div className="text-center">
        <h1 className="text-2xl font-bold">{data.testTitle || 'Test Result'}</h1>
        {data.submittedAt && (
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted {new Date(data.submittedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-md">
        <ScoreRevealAnimation
          percentage={result.percentage || 0}
          grade={result.grade || '-'}
          marksObtained={result.marksObtained || 0}
          totalMarks={result.totalMarks || 0}
        />
      </div>

      {/* Detailed score display */}
      <div className="mx-auto max-w-md">
        <ScoreDisplay
          marksObtained={result.marksObtained || 0}
          totalMarks={result.totalMarks || 0}
          percentage={result.percentage || 0}
          grade={result.grade || '-'}
          rank={result.rank}
          percentile={result.percentile}
          totalStudents={result.totalStudents}
        />
      </div>

      {/* Section breakdown */}
      {result.sectionScores && result.sectionScores.length > 0 && (
        <SectionBreakdown sections={result.sectionScores} />
      )}

      {/* Question review */}
      {questions.length > 0 && <QuestionReviewList questions={questions} />}
    </div>
  );
}
