'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getPlatformCourseAnalytics } from '@/lib/admin-api';
import { PlatformCourseOverview } from '@/components/courses/PlatformCourseOverview';
import { OrgCourseMetricsTable } from '@/components/courses/OrgCourseMetricsTable';
import { TopCoursesTable } from '@/components/courses/TopCoursesTable';
import { Button } from '@/components/ui/button';

export default function PlatformCoursesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getPlatformCourseAnalytics();
      setData(result);
    } catch (err: any) {
      if (err?.status === 404) {
        setData(null);
      } else {
        toast.error(err?.message || 'Failed to load course analytics.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Courses</h2>
          <p className="text-muted-foreground">
            Cross-organisation course analytics and metrics.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading course data...</span>
        </div>
      )}

      {!loading && !data && (
        <div className="rounded-md border p-10 text-center text-muted-foreground">
          No course data available. The endpoint may not be configured yet.
        </div>
      )}

      {data && (
        <>
          <PlatformCourseOverview data={data} />
          <div className="grid gap-6 lg:grid-cols-1">
            <OrgCourseMetricsTable data={data.orgMetrics || []} />
            <TopCoursesTable data={data.topCourses || []} />
          </div>
        </>
      )}
    </div>
  );
}
