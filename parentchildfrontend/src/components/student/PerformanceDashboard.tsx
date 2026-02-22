'use client';

import { useEffect, useState } from 'react';
import { Loader2, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  getAnalytics,
  getScoreTrend,
  getSubjectRadar,
  getElevenPlusAnalytics,
  getMyReports,
  downloadReport,
} from '@/lib/student-api';
import {
  formatPercentile,
  getImprovementLabel,
  getQualificationBandColor,
  getTrendArrow,
} from '@papercraft/shared';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─── KPI Cards ──────────────────────────────────────────────────────────────

function StudentKPICards({ stats }: { stats: Record<string, unknown> }) {
  const avgPct = (stats?.avgPercentage as number) ?? 0;
  const totalTests = (stats?.totalTests as number) ?? 0;
  const improvement = (stats?.improvementRate as number) ?? 0;
  const percentile = stats?.percentileInOrg as number | null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground">Your Average</p>
        <p className="text-2xl font-bold text-blue-600">{avgPct.toFixed(1)}%</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground">Tests Done</p>
        <p className="text-2xl font-bold text-purple-600">{totalTests}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground">Improvement</p>
        <p className={`text-2xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {getImprovementLabel(improvement)}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground">Your Rank</p>
        <p className="text-2xl font-bold text-sky-600">
          {percentile != null ? formatPercentile(percentile) : '—'}
        </p>
      </Card>
    </div>
  );
}

// ─── Improvement Badge ──────────────────────────────────────────────────────

function ImprovementBadge({ subjects }: { subjects: Array<Record<string, unknown>> }) {
  if (!subjects || subjects.length === 0) return null;

  // Find subject with highest positive trend
  let bestSubject: Record<string, unknown> | null = null;
  let bestImprovement = 0;
  for (const s of subjects) {
    const topics = (s.topics as Array<Record<string, unknown>>) || [];
    // Use avgPercentage delta as rough improvement proxy
    if ((s.avgPercentage as number) > bestImprovement) {
      bestImprovement = s.avgPercentage as number;
      bestSubject = s;
    }
  }

  if (!bestSubject) return null;

  return (
    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 flex items-center gap-2">
      <TrendingUp className="h-4 w-4" />
      <span>
        You&apos;re doing well in <strong>{bestSubject.subjectName as string}</strong> with an average of{' '}
        {(bestSubject.avgPercentage as number)?.toFixed(1)}%!
      </span>
    </div>
  );
}

// ─── 11+ Panel ──────────────────────────────────────────────────────────────

function ElevenPlusPanel({ data }: { data: Record<string, unknown> }) {
  const band = data?.band as Record<string, unknown>;
  const components = (data?.components as Array<Record<string, unknown>>) || [];
  const cohort = data?.cohort as Record<string, unknown>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your 11+ Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {band && (
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Your Band</p>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: getQualificationBandColor((band.band as string) || null) }}
              >
                {(band.band as string) || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Average Score</p>
              <p className="text-lg font-bold">{(band.avgScore as number)?.toFixed(1)}%</p>
            </div>
            {cohort && (cohort.cohortSize as number) > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Cohort Rank</p>
                <p className="text-sm">
                  <span className="font-bold">{cohort.percentile as number}th</span> percentile out of{' '}
                  {cohort.cohortSize as number} students
                </p>
              </div>
            )}
          </div>
        )}

        {components.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {components.map((c) => {
              const trend = getTrendArrow((c.trend as number) || 0);
              return (
                <div key={c.component as string} className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">{c.component as string}</p>
                  <p className="text-lg font-bold">{(c.avgPercentage as number)?.toFixed(1)}%</p>
                  <div className="flex items-center gap-1 text-xs">
                    {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                    {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                    {trend === 'flat' && <Minus className="h-3 w-3 text-muted-foreground" />}
                    <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}>
                      {(c.trend as number) > 0 ? `+${(c.trend as number).toFixed(1)}%` : (c.trend as number) < 0 ? `${(c.trend as number).toFixed(1)}%` : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Reports List ───────────────────────────────────────────────────────────

function ReportsList({
  reports,
  onDownload,
}: {
  reports: Array<Record<string, unknown>>;
  onDownload: (reportId: string) => void;
}) {
  if (reports.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {reports.map((r) => (
            <div key={r._id as string} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{r.title as string}</p>
                <p className="text-xs text-muted-foreground">
                  {r.createdAt ? new Date(r.createdAt as string).toLocaleDateString() : ''}
                </p>
              </div>
              {r.status === 'completed' && (
                <Button variant="outline" size="sm" onClick={() => onDownload(r._id as string)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              {r.status !== 'completed' && (
                <Badge variant="outline">{r.status as string}</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export function PerformanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [elevenPlus, setElevenPlus] = useState<Record<string, unknown> | null>(null);
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, reportsData] = await Promise.all([
          getAnalytics(),
          getMyReports(),
        ]);
        setAnalytics(analyticsData);
        setReports(reportsData?.reports || []);

        // Load 11+ data (best-effort)
        try {
          const elevenPlusData = await getElevenPlusAnalytics();
          if (elevenPlusData?.band?.band) {
            setElevenPlus(elevenPlusData);
          }
        } catch {
          // 11+ data is optional
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = async (reportId: string) => {
    try {
      const data = await downloadReport(reportId);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch {
      // Silent fail for downloads
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Performance</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Your Performance</h1>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    );
  }

  const stats = analytics?.overallStats as Record<string, unknown>;
  const subjects = analytics?.subjectBreakdown as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Performance</h1>
        <p className="mt-1 text-muted-foreground">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {stats && <StudentKPICards stats={stats} />}

      {subjects && <ImprovementBadge subjects={subjects} />}

      {/* Charts placeholders — will use shared Recharts components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your score trend chart will render here using ScoreTrendLineChart.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your subject radar chart will render here using SubjectRadarChart.
            </p>
          </CardContent>
        </Card>
      </div>

      {elevenPlus && <ElevenPlusPanel data={elevenPlus} />}

      <ReportsList reports={reports} onDownload={handleDownload} />
    </div>
  );
}
