'use client';

import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { getQuestionAnalytics } from 'src/lib/analytics-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

// ----------------------------------------------------------------------

function getDifficultyColor(diff) {
  if (diff === 'easy') return 'bg-green-100 text-green-700';
  if (diff === 'medium') return 'bg-yellow-100 text-yellow-700';
  if (diff === 'hard') return 'bg-orange-100 text-orange-700';
  if (diff === 'expert') return 'bg-red-100 text-red-700';
  return 'bg-muted text-muted-foreground';
}

function getDiscriminationColor(di) {
  if (di >= 0.3) return 'text-green-600';
  if (di >= 0.2) return 'text-yellow-600';
  return 'text-red-600';
}

export default function QuestionAnalyticsDetailPage() {
  const { questionId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qa, setQa] = useState(null);

  useEffect(() => {
    if (!companyId || !questionId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getQuestionAnalytics(companyId, questionId);
        setQa(data);
      } catch (err) {
        setError(err.message || 'Failed to load question analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, questionId]);

  if (loading) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Question Analytics</h1>
            <p className="text-sm text-muted-foreground">Question ID: {questionId}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {qa && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold">{qa.accuracy?.toFixed(1)}%</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Attempts</p>
                <p className="text-2xl font-bold">{qa.totalAttempts}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{qa.averageTimeSeconds?.toFixed(1)}s</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Discrimination</p>
                <p className={`text-2xl font-bold ${getDiscriminationColor(qa.discriminationIndex)}`}>
                  {qa.discriminationIndex?.toFixed(2)}
                </p>
              </Card>
            </div>

            {/* Difficulty Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Calibration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tagged Difficulty</p>
                    <Badge className={getDifficultyColor(qa.taggedDifficulty)}>
                      {qa.taggedDifficulty}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">&rarr;</span>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Actual Difficulty</p>
                    <Badge className={getDifficultyColor(qa.actualDifficulty)}>
                      {qa.actualDifficulty}
                    </Badge>
                  </div>
                  {qa.taggedDifficulty !== qa.actualDifficulty && (
                    <Badge variant="outline" className="border-amber-300 text-amber-700">
                      Mismatch
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Distractor Analysis */}
            {qa.distractorStats?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distractor Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {qa.distractorStats?.map((d) => (
                      <div key={d.label} className="flex items-center gap-3">
                        <span className="w-8 text-center font-mono font-bold text-sm">{d.label}</span>
                        <div className="flex-1">
                          <div className="h-6 bg-muted rounded overflow-hidden relative">
                            <div
                              className={`h-full rounded ${d.isCorrect ? 'bg-green-500' : 'bg-blue-400'}`}
                              style={{ width: `${Math.min(100, d.selectedPercentage)}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-16 text-right text-sm tabular-nums">
                          {d.selectedPercentage?.toFixed(1)}%
                        </span>
                        <span className="w-12 text-right text-xs text-muted-foreground">
                          ({d.selectedCount})
                        </span>
                        {d.isCorrect && (
                          <span className="text-green-600 text-xs font-medium">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
