'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  listOrganizations,
  getRegistrationStats,
  getTestStats,
  getPlatformCourseAnalytics,
} from '@/lib/admin-api';

interface PlatformStats {
  totalOrganizations: number;
  totalStudents: number;
  totalParents: number;
  totalTests: number;
  totalAttempts: number;
  passRate: number;
  totalCourses: number;
  totalEnrollments: number;
}

export default function PlatformAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [orgRes, regRes, testRes, courseRes] = await Promise.allSettled([
        listOrganizations({ limit: 1 }),
        getRegistrationStats(),
        getTestStats(),
        getPlatformCourseAnalytics(),
      ]);

      setStats({
        totalOrganizations: orgRes.status === 'fulfilled' ? (orgRes.value?.total ?? 0) : 0,
        totalStudents: regRes.status === 'fulfilled' ? (regRes.value?.totalStudents ?? 0) : 0,
        totalParents: regRes.status === 'fulfilled' ? (regRes.value?.totalParents ?? 0) : 0,
        totalTests: testRes.status === 'fulfilled' ? (testRes.value?.totalTests ?? 0) : 0,
        totalAttempts: testRes.status === 'fulfilled' ? (testRes.value?.totalAttempts ?? 0) : 0,
        passRate: testRes.status === 'fulfilled' ? (testRes.value?.passRate ?? 0) : 0,
        totalCourses: courseRes.status === 'fulfilled' ? (courseRes.value?.totalCourses ?? 0) : 0,
        totalEnrollments: courseRes.status === 'fulfilled' ? (courseRes.value?.totalEnrollments ?? 0) : 0,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load platform analytics.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Cross-organization platform-wide metrics overview.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!stats && !loading && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Unable to load platform analytics. Please try again later.
          </CardContent>
        </Card>
      )}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Organizations', value: stats.totalOrganizations, color: 'text-blue-600' },
            { label: 'Students', value: stats.totalStudents, color: 'text-green-600' },
            { label: 'Parents', value: stats.totalParents, color: 'text-purple-600' },
            { label: 'Tests', value: stats.totalTests, color: 'text-sky-600' },
            { label: 'Total Attempts', value: stats.totalAttempts, color: 'text-amber-600' },
            { label: 'Pass Rate', value: stats.passRate, color: 'text-emerald-600' },
            { label: 'Courses', value: stats.totalCourses, color: 'text-rose-600' },
            { label: 'Enrollments', value: stats.totalEnrollments, color: 'text-indigo-600' },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>
                {kpi.label === 'Pass Rate'
                  ? `${kpi.value.toFixed(1)}%`
                  : kpi.value.toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
