'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getInstituteOverview,
  getEnrollmentTrends,
  getTeacherActivity,
  getContentUsage,
  getStudentRetention,
} from 'src/lib/analytics-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function InstituteAnalyticsTab() {
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('6m');
  const [overview, setOverview] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [content, setContent] = useState([]);
  const [retention, setRetention] = useState([]);

  const loadData = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      setError(null);

      const params = { dateRange };
      const [overviewData, teacherData, contentData, retentionData] = await Promise.all([
        getInstituteOverview(companyId, params),
        getTeacherActivity(companyId, params),
        getContentUsage(companyId, params),
        getStudentRetention(companyId, params),
      ]);

      setOverview(overviewData);
      setTeachers(teacherData?.teachers || []);
      setContent(contentData?.content || []);
      setRetention(retentionData?.retention || []);
    } catch (err) {
      setError(err.message || 'Failed to load institute analytics');
    } finally {
      setLoading(false);
    }
  }, [companyId, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Date Range */}
      <div className="flex gap-2">
        {['3m', '6m', '1y'].map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange(range)}
          >
            {range === '3m' ? 'Last 3 Months' : range === '6m' ? 'Last 6 Months' : 'Last Year'}
          </Button>
        ))}
      </div>

      {/* Overview KPIs */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Students', value: overview.totalStudents, color: 'text-blue-600' },
            { label: 'Teachers', value: overview.totalTeachers, color: 'text-purple-600' },
            { label: 'Classes', value: overview.totalClasses, color: 'text-green-600' },
            { label: 'Tests', value: overview.totalTests, color: 'text-sky-600' },
            { label: 'Questions', value: overview.totalQuestions, color: 'text-amber-600' },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>
                {(kpi.value ?? 0).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Enrollment / Retention charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enrollment line chart will render here using EnrollmentLineChart.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Retention bar chart will render here using RetentionBarsChart.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Activity Table */}
      {teachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium text-muted-foreground">Teacher</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Questions</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Tests</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Classes</th>
                    <th className="p-2 font-medium text-muted-foreground">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.teacherId} className="border-b">
                      <td className="p-2">{t.teacherName}</td>
                      <td className="p-2 text-right tabular-nums">{t.questionsCreated}</td>
                      <td className="p-2 text-right tabular-nums">{t.testsCreated}</td>
                      <td className="p-2 text-right tabular-nums">{t.classesManaged}</td>
                      <td className="p-2 text-muted-foreground">
                        {t.lastActive ? new Date(t.lastActive).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Usage Table */}
      {content.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium text-muted-foreground">#</th>
                    <th className="p-2 font-medium text-muted-foreground">Title</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Attempts</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Avg Score</th>
                    <th className="p-2 font-medium text-muted-foreground text-right">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((c, idx) => (
                    <tr key={c.testId || idx} className="border-b">
                      <td className="p-2 text-muted-foreground">{idx + 1}</td>
                      <td className="p-2">{c.testTitle}</td>
                      <td className="p-2 text-right tabular-nums">{c.attemptCount}</td>
                      <td className="p-2 text-right tabular-nums">{c.avgScore?.toFixed(1)}%</td>
                      <td className="p-2 text-right tabular-nums">{c.uniqueStudents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
