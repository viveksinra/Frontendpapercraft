'use client';

import { useState, useEffect } from 'react';
import { getChildPerformance } from '@/lib/parent-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  BarChart3,
} from 'lucide-react';

interface ChildPerformanceChartsProps {
  childId: string;
  orgId?: string;
}

function ProgressBar({
  value,
  max = 100,
  label,
  color = 'bg-primary',
}: {
  value: number;
  max?: number;
  label: string;
  color?: string;
}) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={cn('h-2 rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SimpleBarChart({
  data,
  title,
}: {
  data: { label: string; value: number }[];
  title: string;
}) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-muted-foreground">{item.label}</span>
                <span className="font-medium">{Math.round(item.value)}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreHistoryChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const max = 100;
  const chartHeight = 160;
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
    const y = chartHeight - (((d.score ?? d.value ?? 0) / max) * chartHeight);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score Trend</CardTitle>
        <CardDescription>Performance over recent tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            viewBox={`-5 -5 110 ${chartHeight + 10}`}
            className="h-40 w-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = chartHeight - (val / max) * chartHeight;
              return (
                <line
                  key={val}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={0.5}
                />
              );
            })}
            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="hsl(var(--primary))"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {data.length > 0 && <span>{data[0].label || data[0].testName || ''}</span>}
            {data.length > 1 && (
              <span>
                {data[data.length - 1].label || data[data.length - 1].testName || ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChildPerformanceCharts({
  childId,
  orgId,
}: ChildPerformanceChartsProps) {
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPerformance() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChildPerformance(childId, orgId);
        setPerformance(data.performance || data);
      } catch (err: any) {
        setError(err.message || 'Failed to load performance data.');
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, [childId, orgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No performance data available yet.
        </p>
      </div>
    );
  }

  const overallAverage = performance.overallAverage ?? performance.average;
  const totalTests = performance.totalTests ?? performance.testsCompleted ?? 0;
  const bestScore = performance.bestScore ?? performance.highestScore;
  const subjects = performance.bySubject || performance.subjects || [];
  const history = performance.history || performance.scoreHistory || [];

  const subjectData = Array.isArray(subjects)
    ? subjects.map((s: any) => ({
        label: s.subject || s.name || s.label,
        value: s.average ?? s.score ?? s.value ?? 0,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallAverage !== undefined && overallAverage !== null
                ? `${Math.round(overallAverage)}%`
                : '--'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestScore !== undefined && bestScore !== null
                ? `${Math.round(bestScore)}%`
                : '--'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {history.length > 0 && <ScoreHistoryChart data={history} />}
        {subjectData.length > 0 && (
          <SimpleBarChart data={subjectData} title="Performance by Subject" />
        )}
      </div>

      {/* Subject breakdown with progress bars */}
      {subjectData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Breakdown</CardTitle>
            <CardDescription>Average scores by subject area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectData.map((item, index) => (
              <ProgressBar
                key={index}
                label={item.label}
                value={item.value}
                color={
                  item.value >= 80
                    ? 'bg-green-500'
                    : item.value >= 60
                    ? 'bg-blue-500'
                    : item.value >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
