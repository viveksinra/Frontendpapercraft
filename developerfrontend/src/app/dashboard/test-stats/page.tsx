'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TestStats {
  totalTests: number;
  totalAttempts: number;
  passRate: number;
  testsByMode: Record<string, number>;
  testsByStatus: Record<string, number>;
}

const MODE_LABELS: Record<string, string> = {
  live_mock: 'Live Mock',
  anytime_mock: 'Anytime Mock',
  practice: 'Practice',
  classroom: 'Classroom',
  section_timed: 'Section Timed',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  live: 'Live',
  completed: 'Completed',
  archived: 'Archived',
};

const MODE_COLORS: Record<string, string> = {
  live_mock: 'bg-blue-500',
  anytime_mock: 'bg-violet-500',
  practice: 'bg-green-500',
  classroom: 'bg-amber-500',
  section_timed: 'bg-rose-500',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400',
  scheduled: 'bg-blue-400',
  live: 'bg-green-500',
  completed: 'bg-emerald-600',
  archived: 'bg-slate-500',
};

async function fetchTestStats(): Promise<TestStats> {
  const res = await axiosInstance.get('/api/v2/admin/test-stats');
  return res.data;
}

function BarChart({
  data,
  labels,
  colors,
}: {
  data: Record<string, number>;
  labels: Record<string, string>;
  colors: Record<string, string>;
}) {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{labels[key] || key}</span>
            <span className="font-medium">{value.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${colors[key] || 'bg-primary'}`}
              style={{ width: `${(value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No data available.</p>
      )}
    </div>
  );
}

export default function TestStatsPage() {
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchTestStats();
      setStats(data);
    } catch (err: any) {
      if (err?.status === 404) {
        setStats(null);
      } else {
        toast.error(err?.message || 'Failed to load test stats.');
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Global Test Stats</h2>
          <p className="text-muted-foreground">
            Platform-wide test statistics and aggregations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && !stats && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading stats...</span>
        </div>
      )}

      {!loading && !stats && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No stats data available. The endpoint may not be configured yet.
          </CardContent>
        </Card>
      )}

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tests</CardDescription>
                <CardTitle className="text-3xl">{stats.totalTests.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  All tests created on the platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Attempts</CardDescription>
                <CardTitle className="text-3xl">{stats.totalAttempts.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Total test attempts across all students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Platform Pass Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {stats.passRate != null ? `${stats.passRate.toFixed(1)}%` : '\u2014'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Overall pass rate across all completed tests
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tests by Mode</CardTitle>
                <CardDescription>Distribution of tests across different modes.</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={stats.testsByMode || {}}
                  labels={MODE_LABELS}
                  colors={MODE_COLORS}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tests by Status</CardTitle>
                <CardDescription>Current status distribution of all tests.</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={stats.testsByStatus || {}}
                  labels={STATUS_LABELS}
                  colors={STATUS_COLORS}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
