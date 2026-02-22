'use client';

import { formatPercentile, getImprovementLabel } from '@papercraft/shared';

import { Card } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function StudentKPICards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Average Score',
      value: `${stats.avgPercentage?.toFixed(1) ?? 0}%`,
      color: 'text-blue-600',
    },
    {
      title: 'Tests Done',
      value: stats.totalTests ?? 0,
      color: 'text-purple-600',
    },
    {
      title: 'Improvement',
      value: getImprovementLabel(stats.improvementRate ?? 0),
      color: (stats.improvementRate ?? 0) >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Percentile',
      value: stats.percentileInOrg != null ? formatPercentile(stats.percentileInOrg) : '—',
      color: 'text-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-4">
          <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
