'use client';

import { Star } from 'lucide-react';

export default function RatingDistributionChart({ distribution = {} }) {
  const total = Object.values(distribution).reduce((s, v) => s + v, 0) || 1;

  return (
    <div className="flex flex-col gap-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = distribution[stars] || 0;
        const pct = (count / total) * 100;

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-sm w-8">
              {stars} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </span>
            <div className="flex-1 bg-muted rounded-full h-3">
              <div className="h-3 rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-16 text-right">
              {count} ({pct.toFixed(0)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
