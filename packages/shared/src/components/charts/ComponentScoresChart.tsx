import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ComponentScoresChartProps {
  components: Array<{ name: string; score: number; trend: number }>;
  height?: number;
}

function TrendIndicator({ trend }: { trend: number }) {
  if (trend > 0.5) {
    return <span className="text-green-600 text-xs font-medium ml-1">+{trend.toFixed(1)}% ▲</span>;
  }
  if (trend < -0.5) {
    return <span className="text-red-600 text-xs font-medium ml-1">{trend.toFixed(1)}% ▼</span>;
  }
  return <span className="text-muted-foreground text-xs ml-1">—</span>;
}

export function ComponentScoresChart({
  components,
  height = 250,
}: ComponentScoresChartProps) {
  if (components.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No component data available
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={components}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} />
          <YAxis type="category" dataKey="name" fontSize={12} width={90} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
          />
          <Bar dataKey="score" fill="#2563eb" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Trend indicators below chart */}
      <div className="flex flex-wrap gap-4 mt-2 px-4">
        {components.map((c) => (
          <div key={c.name} className="flex items-center text-sm">
            <span className="font-medium">{c.name}:</span>
            <TrendIndicator trend={c.trend} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComponentScoresChart;
