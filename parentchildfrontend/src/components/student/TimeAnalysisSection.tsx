'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, TrendingUp, Timer } from 'lucide-react';

interface TimeAnalysisData {
  averageTimePerQuestion: number; // seconds
  fastestQuestion: number; // seconds
  slowestQuestion: number; // seconds
  totalTimeSpent: number; // seconds
  questionsWithinTarget?: number;
  totalQuestions?: number;
}

interface TimeAnalysisSectionProps {
  data: TimeAnalysisData;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function TimeAnalysisSection({ data }: TimeAnalysisSectionProps) {
  const stats = [
    {
      label: 'Avg Time / Question',
      value: formatTime(data.averageTimePerQuestion),
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Fastest Answer',
      value: formatTime(data.fastestQuestion),
      icon: Zap,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Slowest Answer',
      value: formatTime(data.slowestQuestion),
      icon: Timer,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Total Time Spent',
      value: formatTime(data.totalTimeSpent),
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Time Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <div className={`rounded-md bg-muted p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {data.questionsWithinTarget != null && data.totalQuestions != null && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {data.questionsWithinTarget} / {data.totalQuestions}
              </span>{' '}
              questions answered within target time
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
