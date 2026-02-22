'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, Target, Flame } from 'lucide-react';

interface StatsBarProps {
  testsTaken: number;
  averageScore: number | null;
  streak: number;
}

export function StatsBar({ testsTaken = 0, averageScore = null, streak = 0 }: StatsBarProps) {
  const stats = [
    {
      label: 'Tests Taken',
      value: (testsTaken ?? 0).toString(),
      icon: FileCheck,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Average Score',
      value: averageScore != null ? `${averageScore.toFixed(0)}%` : '--',
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Streak',
      value: `${streak ?? 0} days`,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
