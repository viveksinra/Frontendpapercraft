'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, FileText } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getClassTestAnalytics, getClassRankings } from 'src/lib/analytics-api';
import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function ClassTestAnalyticsPage() {
  const { classId, testId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testAnalytics, setTestAnalytics] = useState(null);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    if (!companyId || !classId || !testId) return;
    (async () => {
      try {
        setLoading(true);
        const [analyticsData, rankingsData] = await Promise.all([
          getClassTestAnalytics(companyId, classId, testId),
          getClassRankings(companyId, classId, testId),
        ]);
        setTestAnalytics(analyticsData);
        setRankings(rankingsData?.rankings || []);
      } catch (err) {
        setError(err.message || 'Failed to load test analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, classId, testId]);

  if (loading) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const stats = testAnalytics?.scoreStats;

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Class Test Analytics</h1>
              <p className="text-sm text-muted-foreground">Test: {testId}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() =>
              router.push(`${paths.dashboard.reports.generate}?classId=${classId}&type=class_summary`)
            }
          >
            <FileText className="h-4 w-4 mr-1" />
            Generate Class Report
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Score Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Average', value: `${stats.avg?.toFixed(1)}%` },
              { label: 'Median', value: `${stats.median?.toFixed(1)}%` },
              { label: 'Highest', value: `${stats.highest?.toFixed(1)}%` },
              { label: 'Lowest', value: `${stats.lowest?.toFixed(1)}%` },
              { label: 'Std Dev', value: stats.stdDev?.toFixed(1) },
            ].map((item) => (
              <Card key={item.label} className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Score Distribution placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Score distribution histogram will be rendered here.
            </p>
          </CardContent>
        </Card>

        {/* Student Rankings */}
        {rankings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Student Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2 font-medium text-muted-foreground">Rank</th>
                      <th className="p-2 font-medium text-muted-foreground">Student</th>
                      <th className="p-2 font-medium text-muted-foreground text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((r, idx) => (
                      <tr key={r.studentId || idx} className="border-b">
                        <td className="p-2 tabular-nums">#{r.rank || idx + 1}</td>
                        <td className="p-2">{r.studentName || r.studentId}</td>
                        <td className="p-2 text-right font-medium tabular-nums">
                          {r.percentage?.toFixed(1)}%
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
