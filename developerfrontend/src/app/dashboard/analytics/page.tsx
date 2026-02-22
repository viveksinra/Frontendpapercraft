'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Developer Frontend analytics — platform-wide metrics
// In production, this would call a developer-level API endpoint
// For now, stubs with placeholder content

export default function PlatformAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    // TODO: Replace with actual developer API call
    const timer = setTimeout(() => {
      setStats({
        totalOrganizations: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalTests: 0,
        totalQuestions: 0,
        totalAttempts: 0,
        avgDiscriminationIndex: 0,
        problematicQuestionsPct: 0,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Cross-organization platform-wide metrics and question quality overview.
        </p>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Organizations', value: stats?.totalOrganizations ?? 0, color: 'text-blue-600' },
          { label: 'Students', value: stats?.totalStudents ?? 0, color: 'text-green-600' },
          { label: 'Teachers', value: stats?.totalTeachers ?? 0, color: 'text-purple-600' },
          { label: 'Tests', value: stats?.totalTests ?? 0, color: 'text-sky-600' },
          { label: 'Questions', value: stats?.totalQuestions ?? 0, color: 'text-amber-600' },
          { label: 'Total Attempts', value: stats?.totalAttempts ?? 0, color: 'text-rose-600' },
          { label: 'Avg Discrimination', value: stats?.avgDiscriminationIndex ?? 0, color: 'text-emerald-600' },
          { label: 'Problematic %', value: stats?.problematicQuestionsPct ?? 0, color: 'text-red-600' },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>
              {typeof kpi.value === 'number' && kpi.value % 1 !== 0
                ? kpi.value.toFixed(2)
                : kpi.value.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      {/* Per-Org Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Per-organization analytics table will display here when the developer analytics API is connected.
          </p>
        </CardContent>
      </Card>

      {/* Question Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Question Bank Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aggregate question bank quality metrics across all organizations will display here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
