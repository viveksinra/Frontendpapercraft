'use client';

import { BarChart3, TrendingUp, ArrowUp, ArrowDown, Percent } from 'lucide-react';

import { Card } from '@/components/ui/card';

const CARD_CONFIG = [
  { key: 'averageScore', label: 'Average Score', icon: BarChart3, format: (v) => `${v?.toFixed(1) ?? '--'}%` },
  { key: 'medianScore', label: 'Median Score', icon: TrendingUp, format: (v) => `${v?.toFixed(1) ?? '--'}%` },
  { key: 'highestScore', label: 'Highest Score', icon: ArrowUp, format: (v) => `${v?.toFixed(1) ?? '--'}%` },
  { key: 'lowestScore', label: 'Lowest Score', icon: ArrowDown, format: (v) => `${v?.toFixed(1) ?? '--'}%` },
  { key: 'passRate', label: 'Pass Rate', icon: Percent, format: (v) => `${v?.toFixed(1) ?? '--'}%` },
];

export default function ResultSummaryCards({ stats = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {CARD_CONFIG.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-1">{format(stats[key])}</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
