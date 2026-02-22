'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getStudentAnalytics,
  getStudentScoreTrend,
  getStudentSubjectRadar,
} from 'src/lib/analytics-api';
import { paths } from 'src/routes/paths';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import StudentKPICards from './StudentKPICards';
import ElevenPlusPanel from './ElevenPlusPanel';

// ----------------------------------------------------------------------

export default function StudentAnalyticsTab() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!companyId || !studentId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentAnalytics(companyId, studentId.trim());
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to load student analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [companyId, studentId]);

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Student Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter student ID to view analytics..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !studentId.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {!analytics && !loading && !error && (
        <div className="text-center py-12 text-muted-foreground">
          Search for a student to view their analytics dashboard.
        </div>
      )}

      {analytics && (
        <>
          {/* KPI Cards */}
          <StudentKPICards stats={analytics.overallStats} />

          {/* Charts placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Score trend chart will render here using ScoreTrendLineChart.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Subject radar chart will render here using SubjectRadarChart.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 11+ Panel */}
          {analytics.elevenPlusAnalytics && (
            <ElevenPlusPanel data={analytics.elevenPlusAnalytics} />
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() =>
                router.push(paths.dashboard.analytics.students.detail(studentId.trim()))
              }
            >
              View Full Profile
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `${paths.dashboard.reports.generate}?studentId=${studentId.trim()}`
                )
              }
            >
              Generate Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
