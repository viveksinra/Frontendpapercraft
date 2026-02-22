'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  listQuestionAnalytics,
  getProblematicQuestions,
  getDifficultyCalibration,
} from 'src/lib/analytics-api';
import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

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

export default function QuestionAnalyticsTab() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('accuracy');
  const [difficulty, setDifficulty] = useState('');
  const [problematicCount, setProblematicCount] = useState(0);
  const [calibration, setCalibration] = useState(null);

  const loadData = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      setError(null);

      const params = { page, pageSize: 20, sortBy, sortOrder: 'asc' };
      if (difficulty) params.difficulty = difficulty;

      const [listData, problematicData, calibrationData] = await Promise.all([
        listQuestionAnalytics(companyId, params),
        getProblematicQuestions(companyId),
        getDifficultyCalibration(companyId),
      ]);

      setQuestions(listData?.questions || []);
      setTotal(listData?.total || 0);
      setProblematicCount(problematicData?.questions?.length || 0);
      setCalibration(calibrationData);
    } catch (err) {
      setError(err.message || 'Failed to load question analytics');
    } finally {
      setLoading(false);
    }
  }, [companyId, page, sortBy, difficulty]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col gap-6 py-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Problematic Alert */}
      {problematicCount > 0 && (
        <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <span>
            <strong>{problematicCount}</strong> problematic questions detected
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="accuracy">Accuracy</SelectItem>
            <SelectItem value="discriminationIndex">Discrimination</SelectItem>
            <SelectItem value="totalAttempts">Usage</SelectItem>
            <SelectItem value="averageTimeSeconds">Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question Analytics Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No question analytics data available.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3 font-medium text-muted-foreground">Question</th>
                    <th className="p-3 font-medium text-muted-foreground">Tagged</th>
                    <th className="p-3 font-medium text-muted-foreground">Actual</th>
                    <th className="p-3 font-medium text-muted-foreground text-right">DI</th>
                    <th className="p-3 font-medium text-muted-foreground text-right">Accuracy</th>
                    <th className="p-3 font-medium text-muted-foreground text-right">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr
                      key={q._id || q.questionId}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() =>
                        router.push(
                          paths.dashboard.analytics.questions.detail(q.questionId || q._id)
                        )
                      }
                    >
                      <td className="p-3 max-w-[200px] truncate">{q.questionId}</td>
                      <td className="p-3">
                        <Badge className={getDifficultyColor(q.taggedDifficulty)}>
                          {q.taggedDifficulty}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getDifficultyColor(q.actualDifficulty)}>
                          {q.actualDifficulty}
                        </Badge>
                        {q.taggedDifficulty !== q.actualDifficulty && (
                          <AlertTriangle className="inline h-3 w-3 text-amber-500 ml-1" />
                        )}
                      </td>
                      <td
                        className={`p-3 text-right font-medium tabular-nums ${getDiscriminationColor(q.discriminationIndex)}`}
                      >
                        {q.discriminationIndex?.toFixed(2)}
                      </td>
                      <td className="p-3 text-right tabular-nums">{q.accuracy?.toFixed(1)}%</td>
                      <td className="p-3 text-right tabular-nums">{q.totalAttempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Difficulty Calibration */}
      {calibration && (
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Calibration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(calibration).map(([level, data]) => (
                <div key={level} className="rounded-md border p-3">
                  <Badge className={getDifficultyColor(level)}>{level}</Badge>
                  <p className="text-sm mt-2">
                    <span className="font-medium">{data?.totalQuestions || 0}</span> questions
                  </p>
                  <p className="text-sm">
                    Avg accuracy: <span className="font-medium">{data?.avgAccuracy?.toFixed(1) || 0}%</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
