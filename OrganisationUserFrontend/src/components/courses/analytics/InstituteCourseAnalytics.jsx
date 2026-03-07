'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

import { getInstituteCourseAnalytics } from 'src/lib/course-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Badge } from '@/components/ui/badge';

function KPICard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

export default function InstituteCourseAnalytics() {
  const companyId = getActiveCompanyIdFromCookie();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await getInstituteCourseAnalytics(companyId);
      setData(result?.analytics || result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">No course analytics data available.</p>;
  }

  const topCourses = data.topCourses || [];

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard icon={BookOpen} label="Total Courses" value={data.totalCourses || 0} />
        <KPICard icon={Users} label="Total Enrollments" value={data.totalEnrollments || 0} />
        <KPICard icon={CheckCircle2} label="Total Completions" value={data.totalCompletions || 0} />
        <KPICard icon={TrendingUp} label="Course Revenue" value={`£${(data.totalRevenue || 0).toFixed(0)}`} />
      </div>

      {/* Status breakdown */}
      {data.coursesByStatus && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Courses by Status</h3>
          <div className="flex gap-4">
            {Object.entries(data.coursesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge variant="outline">{status}</Badge>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top courses table */}
      {topCourses.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Top Courses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Course</th>
                  <th className="text-right py-2 px-3 font-medium">Enrollments</th>
                  <th className="text-right py-2 px-3 font-medium">Completion</th>
                  <th className="text-right py-2 px-3 font-medium">Avg Rating</th>
                  <th className="text-right py-2 px-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course, i) => (
                  <tr key={i} className="border-b hover:bg-accent/50">
                    <td className="py-2 px-3 font-medium">{course.title}</td>
                    <td className="py-2 px-3 text-right">{course.enrollmentCount || 0}</td>
                    <td className="py-2 px-3 text-right">{(course.completionRate || 0).toFixed(0)}%</td>
                    <td className="py-2 px-3 text-right">{course.avgRating ? course.avgRating.toFixed(1) : '-'}</td>
                    <td className="py-2 px-3 text-right">£{(course.revenue || 0).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
