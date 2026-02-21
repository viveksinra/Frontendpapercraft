'use client';

const RANGES = [
  { label: '0-20', key: '0-20', color: 'bg-red-500' },
  { label: '21-40', key: '21-40', color: 'bg-orange-500' },
  { label: '41-60', key: '41-60', color: 'bg-yellow-500' },
  { label: '61-80', key: '61-80', color: 'bg-blue-500' },
  { label: '81-100', key: '81-100', color: 'bg-green-500' },
];

export default function ScoreDistributionChart({ distribution = {} }) {
  const values = RANGES.map((r) => distribution[r.key] ?? 0);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Score Distribution</h3>

      <div className="flex items-end gap-3 h-48">
        {RANGES.map((range, idx) => {
          const count = values[idx];
          const heightPercent = (count / maxVal) * 100;

          return (
            <div key={range.key} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground">{count}</span>
              <div className="w-full flex items-end" style={{ height: '160px' }}>
                <div
                  className={`w-full rounded-t-md transition-all ${range.color}`}
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{range.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
