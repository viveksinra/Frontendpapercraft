'use client';

import { useEffect, useState } from 'react';
import { Loader2, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  getChildAnalytics,
  getChildScoreTrend,
  getChildSubjectRadar,
  getChildElevenPlusAnalytics,
  getChildReports,
  downloadChildReport,
} from '@/lib/parent-api';
import {
  formatPercentile,
  getImprovementLabel,
  getQualificationBandColor,
  getTrendArrow,
  ScoreTrendLineChart,
  SubjectRadarChart,
} from '@papercraft/shared';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─── Improvement Summary ────────────────────────────────────────────────────

function ChildImprovementSummary({
  stats,
  childName,
}: {
  stats: Record<string, unknown>;
  childName: string;
}) {
  const totalTests = (stats?.totalTests as number) ?? 0;
  const avgPct = (stats?.avgPercentage as number) ?? 0;
  const improvement = (stats?.improvementRate as number) ?? 0;

  const name = childName || 'Your child';

  let improvementText = '';
  if (improvement > 0) {
    improvementText = `${name} has improved by ${improvement.toFixed(1)}% since starting.`;
  } else if (improvement < 0) {
    improvementText = `${name}'s scores have dipped by ${Math.abs(improvement).toFixed(1)}% recently. Extra practice in weaker areas may help.`;
  } else {
    improvementText = `${name}'s performance has been steady.`;
  }

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="pt-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {name} has taken <strong>{totalTests} tests</strong> with an average score of{' '}
          <strong>{avgPct.toFixed(1)}%</strong>. {improvementText}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Class Comparison ───────────────────────────────────────────────────────

function ChildClassComparison({
  subjects,
  childName,
}: {
  subjects: Array<Record<string, unknown>>;
  childName: string;
}) {
  if (!subjects || subjects.length === 0) return null;

  const name = childName || 'Your child';
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const s of subjects) {
    const avg = (s.avgPercentage as number) || 0;
    const subjectName = s.subjectName as string;
    if (avg >= 70) {
      strengths.push(subjectName);
    } else if (avg < 50) {
      weaknesses.push(subjectName);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {strengths.length > 0 && (
            <>
              {name} performs well in <strong>{strengths.join(', ')}</strong>.{' '}
            </>
          )}
          {weaknesses.length > 0 && (
            <>
              Focus area{weaknesses.length > 1 ? 's' : ''}: <strong>{weaknesses.join(', ')}</strong>
              . Extra practice in {weaknesses.length > 1 ? 'these subjects' : 'this subject'} is recommended.
            </>
          )}
          {strengths.length === 0 && weaknesses.length === 0 && (
            <>
              {name}&apos;s performance is balanced across all subjects.
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── 11+ Panel ──────────────────────────────────────────────────────────────

function ChildElevenPlusPanel({
  data,
  childName,
}: {
  data: Record<string, unknown>;
  childName: string;
}) {
  const band = data?.band as Record<string, unknown>;
  const components = (data?.components as Array<Record<string, unknown>>) || [];
  const cohort = data?.cohort as Record<string, unknown>;
  const name = childName || 'Your child';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Child&apos;s 11+ Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {band && (
          <div>
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-base font-bold text-white"
                style={{ backgroundColor: getQualificationBandColor((band.band as string) || null) }}
              >
                {(band.band as string) || 'N/A'}
              </span>
              <span className="text-lg font-bold">{(band.avgScore as number)?.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on the last {band.testCount as number} mock test{(band.testCount as number) !== 1 ? 's' : ''},
              {' '}{name} is predicted to achieve a{' '}
              <strong>{band.band as string}</strong> result.
              {cohort && (cohort.cohortSize as number) > 0 && (
                <> This places {name.toLowerCase().endsWith('s') ? name : name} in the{' '}
                  <strong>{cohort.percentile as number}th percentile</strong> out of {cohort.cohortSize as number} students.
                </>
              )}
            </p>
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

function ChildReportsList({
  reports,
  childId,
}: {
  reports: Array<Record<string, unknown>>;
  childId: string;
}) {
  if (reports.length === 0) return null;

  const handleDownload = async (reportId: string) => {
    try {
      const data = await downloadChildReport(childId, reportId);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch {
      // Silent fail
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
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
                <Button variant="outline" size="sm" onClick={() => handleDownload(r._id as string)}>
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

export function ChildAnalyticsDashboard({ childId, childName }: { childId: string; childName?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [elevenPlus, setElevenPlus] = useState<Record<string, unknown> | null>(null);
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([]);
  const [scoreTrend, setScoreTrend] = useState<Array<{ date: string; score: number; classAvg?: number }>>([]);
  const [subjectRadar, setSubjectRadar] = useState<Array<{ subject: string; studentAvg: number; classAvg?: number }>>([]);

  const name = childName || 'Your child';

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, reportsData] = await Promise.all([
          getChildAnalytics(childId),
          getChildReports(childId),
        ]);
        setAnalytics(analyticsData);
        setReports(reportsData?.reports || []);

        // Load chart and 11+ data (best-effort, non-blocking)
        const [trendRes, radarRes, elevenPlusRes] = await Promise.allSettled([
          getChildScoreTrend(childId),
          getChildSubjectRadar(childId),
          getChildElevenPlusAnalytics(childId),
        ]);
        if (trendRes.status === 'fulfilled' && trendRes.value?.trend) {
          setScoreTrend(trendRes.value.trend);
        }
        if (radarRes.status === 'fulfilled' && radarRes.value?.subjects) {
          setSubjectRadar(radarRes.value.subjects);
        }
        if (elevenPlusRes.status === 'fulfilled' && elevenPlusRes.value?.band?.band) {
          setElevenPlus(elevenPlusRes.value);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  }

  const stats = analytics?.overallStats as Record<string, unknown>;
  const subjects = analytics?.subjectBreakdown as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      {/* Summary narrative */}
      {stats && <ChildImprovementSummary stats={stats} childName={name} />}

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {((stats.avgPercentage as number) ?? 0).toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Tests Done</p>
            <p className="text-2xl font-bold text-purple-600">{(stats.totalTests as number) ?? 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Improvement</p>
            <p className={`text-2xl font-bold ${((stats.improvementRate as number) ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getImprovementLabel((stats.improvementRate as number) ?? 0)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Rank</p>
            <p className="text-2xl font-bold text-sky-600">
              {(stats.percentileInOrg as number) != null
                ? formatPercentile(stats.percentileInOrg as number)
                : '—'}
            </p>
          </Card>
        </div>
      )}

      {/* Class comparison narrative */}
      {subjects && <ChildClassComparison subjects={subjects} childName={name} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreTrendLineChart data={scoreTrend} height={300} showClassAvg />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectRadarChart data={subjectRadar} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* 11+ Panel */}
      {elevenPlus && <ChildElevenPlusPanel data={elevenPlus} childName={name} />}

      {/* Reports */}
      <ChildReportsList reports={reports} childId={childId} />
    </div>
  );
}
