'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getClassTestAnalytics } from 'src/lib/analytics-api';
import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function ClassAnalyticsTab() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [classId, setClassId] = useState('');
  const [testId, setTestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testAnalytics, setTestAnalytics] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!companyId || !classId.trim() || !testId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getClassTestAnalytics(companyId, classId.trim(), testId.trim());
      setTestAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to load class test analytics');
      setTestAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [companyId, classId, testId]);

  const stats = testAnalytics?.scoreStats;

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Class & Test Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Enter class ID"
              className="flex-1"
            />
            <Input
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder="Enter test ID"
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !classId.trim() || !testId.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyse'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {!testAnalytics && !loading && !error && (
        <div className="text-center py-12 text-muted-foreground">
          Select a class and test to view performance analytics.
        </div>
      )}

      {testAnalytics && (
        <>
          {/* Score Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'Average', value: `${stats.avg?.toFixed(1)}%`, color: 'text-blue-600' },
                { label: 'Median', value: `${stats.median?.toFixed(1)}%`, color: 'text-purple-600' },
                { label: 'Highest', value: `${stats.highest?.toFixed(1)}%`, color: 'text-green-600' },
                { label: 'Lowest', value: `${stats.lowest?.toFixed(1)}%`, color: 'text-red-600' },
                { label: 'Completion', value: `${(testAnalytics.completionRate * 100)?.toFixed(0)}%`, color: 'text-sky-600' },
              ].map((item) => (
                <Card key={item.label} className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
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
                Score distribution histogram will render here using ScoreDistributionHistogram.
              </p>
            </CardContent>
          </Card>

          {/* Top / Bottom Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                {testAnalytics.topPerformers?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {testAnalytics.topPerformers.map((p, i) => (
                      <div key={p.studentId || i} className="flex justify-between text-sm">
                        <span>{p.studentName || p.studentId}</span>
                        <span className="font-medium tabular-nums">{p.percentage?.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Need Support</CardTitle>
              </CardHeader>
              <CardContent>
                {testAnalytics.bottomPerformers?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {testAnalytics.bottomPerformers.map((p, i) => (
                      <div key={p.studentId || i} className="flex justify-between text-sm">
                        <span>{p.studentName || p.studentId}</span>
                        <span className="font-medium tabular-nums">{p.percentage?.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() =>
                router.push(paths.dashboard.analytics.classes.testDetail(classId.trim(), testId.trim()))
              }
            >
              View Full Details
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `${paths.dashboard.reports.generate}?classId=${classId.trim()}&type=class_summary`
                )
              }
            >
              Generate Class Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
