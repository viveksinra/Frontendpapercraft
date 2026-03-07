'use client';

import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getClassTrend, getClassAnalytics } from 'src/lib/analytics-api';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function ClassAnalyticsDetailPage() {
  const { classId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    if (!companyId || !classId) return undefined;
    (async () => {
      try {
        setLoading(true);
        const [overviewData, trendData] = await Promise.all([
          getClassAnalytics(companyId, classId),
          getClassTrend(companyId, classId),
        ]);
        setOverview(overviewData);
        setTrend(trendData?.trend || []);
      } catch (err) {
        setError(err.message || 'Failed to load class analytics');
      } finally {
        setLoading(false);
      }
    })();
    return undefined;
  }, [companyId, classId]);

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
            <h1 className="text-2xl font-bold tracking-tight">Class Analytics</h1>
            <p className="text-sm text-muted-foreground">Class ID: {classId}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Overview KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Students</p>
            <p className="text-3xl font-bold">{overview?.studentCount ?? '—'}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Tests</p>
            <p className="text-3xl font-bold">{overview?.testCount ?? '—'}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
            <p className="text-3xl font-bold">
              {overview?.avgScore != null ? `${overview.avgScore.toFixed(1)}%` : '—'}
            </p>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Class performance trend chart will be rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
