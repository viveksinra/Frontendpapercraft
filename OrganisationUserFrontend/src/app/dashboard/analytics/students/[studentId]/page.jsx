'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, FileText, RefreshCw, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getElevenPlusBand,
  getStudentAnalytics,
  getStudentTimeTrend,
  getStudentScoreTrend,
  getStudentSubjectRadar,
  getElevenPlusComponents,
  getElevenPlusCohortPercentile,
} from 'src/lib/analytics-api';

import { Button } from '@/components/ui/button';
import StudentKPICards from 'src/components/analytics/StudentKPICards';
import ElevenPlusPanel from 'src/components/analytics/ElevenPlusPanel';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function StudentAnalyticsDetailPage() {
  const { studentId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [scoreTrend, setScoreTrend] = useState([]);
  const [subjectRadar, setSubjectRadar] = useState([]);
  const [timeTrend, setTimeTrend] = useState([]);
  const [elevenPlus, setElevenPlus] = useState(null);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!companyId || !studentId) return undefined;
      try {
        setLoading(true);
        setError(null);

        const params = forceRefresh ? { forceRefresh: 'true' } : {};

        const [analyticsData, trendData, radarData, timeData] = await Promise.all([
          getStudentAnalytics(companyId, studentId, params),
          getStudentScoreTrend(companyId, studentId, params),
          getStudentSubjectRadar(companyId, studentId, params),
          getStudentTimeTrend(companyId, studentId, params),
        ]);

        setAnalytics(analyticsData);
        setScoreTrend(trendData?.trend || []);
        setSubjectRadar(radarData?.subjects || []);
        setTimeTrend(timeData?.trend || []);

        // Load 11+ data (best-effort)
        try {
          const [band, components, cohort] = await Promise.all([
            getElevenPlusBand(companyId, studentId),
            getElevenPlusComponents(companyId, studentId),
            getElevenPlusCohortPercentile(companyId, studentId),
          ]);
          if (band?.band) {
            setElevenPlus({ band, components, cohort });
          }
        } catch {
          // 11+ data is optional
        }
      } catch (err) {
        setError(err.message || 'Failed to load student analytics');
      } finally {
        setLoading(false);
      }
    },
    [companyId, studentId]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  const stats = analytics?.overallStats;

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Analytics</h1>
              <p className="text-sm text-muted-foreground">Student ID: {studentId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadData(true)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() =>
                router.push(`${paths.dashboard.reports.generate}?studentId=${studentId}`)
              }
            >
              <FileText className="h-4 w-4 mr-1" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {stats && <StudentKPICards stats={stats} />}

        {/* Score Trend */}
        {scoreTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Score trend chart will be rendered here using ScoreTrendLineChart.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subject Radar + Difficulty Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Subject radar chart will be rendered here using SubjectRadarChart.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Difficulty Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Difficulty analysis chart will be rendered here using DifficultyAnalysisBars.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Time Analysis */}
        {timeTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Time analysis chart will be rendered here using TimeAnalysisChart.
              </p>
            </CardContent>
          </Card>
        )}

        {/* 11+ Panel */}
        {elevenPlus && <ElevenPlusPanel data={elevenPlus} />}

        {/* Recent Test Results */}
        {analytics?.testPerformance?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2 font-medium text-muted-foreground">Test</th>
                      <th className="p-2 font-medium text-muted-foreground text-right">Score</th>
                      <th className="p-2 font-medium text-muted-foreground text-right">Rank</th>
                      <th className="p-2 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.testPerformance.slice(0, 20).map((test) => (
                      <tr key={test.testId} className="border-b">
                        <td className="p-2">{test.testTitle}</td>
                        <td className="p-2 text-right font-medium tabular-nums">
                          {test.percentage?.toFixed(1)}%
                        </td>
                        <td className="p-2 text-right tabular-nums">
                          {test.rank != null ? `#${test.rank}` : '—'}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {test.date ? new Date(test.date).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
