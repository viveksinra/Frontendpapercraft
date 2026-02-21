'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import axiosInstance from '@/lib/axios';
import { v2Endpoints } from '@/lib/v2-endpoints';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import ResultSummaryCards from './ResultSummaryCards';
import ScoreDistributionChart from './ScoreDistributionChart';
import MostMissedQuestions from './MostMissedQuestions';
import StudentResultsTable from './StudentResultsTable';
import ResultExportButton from './ResultExportButton';

export default function ResultDashboard({ testId, companyId }) {
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!testId || !companyId) return;

    setLoading(true);
    setError(null);

    try {
      const [statsRes, attemptsRes] = await Promise.all([
        axiosInstance.get(v2Endpoints.onlineTests.stats(companyId, testId)),
        axiosInstance.get(v2Endpoints.onlineTests.attempts(companyId, testId)),
      ]);

      setStats(statsRes.data);
      setAttempts(attemptsRes.data?.attempts ?? attemptsRes.data ?? []);
    } catch (err) {
      console.error('Failed to fetch result data:', err);
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [testId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">{error}</p>
        <button
          className="mt-2 text-sm text-primary underline"
          onClick={fetchData}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Test Results</h2>
        <ResultExportButton companyId={companyId} testId={testId} />
      </div>

      {/* Summary Cards */}
      <ResultSummaryCards stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreDistributionChart distribution={stats?.distribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Missed Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <MostMissedQuestions questions={stats?.mostMissedQuestions} />
          </CardContent>
        </Card>
      </div>

      {/* Student Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student Results</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentResultsTable attempts={attempts} />
        </CardContent>
      </Card>
    </div>
  );
}
