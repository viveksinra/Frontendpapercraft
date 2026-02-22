import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface RetentionBarsChartProps {
  data: Array<{ period: string; rate: number }>;
  height?: number;
}

function getBarColor(rate: number): string {
  if (rate >= 80) return "#22c55e";
  if (rate >= 60) return "#eab308";
  if (rate >= 40) return "#f97316";
  return "#ef4444";
}

export function RetentionBarsChart({
  data,
  height = 250,
}: RetentionBarsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No retention data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="period" fontSize={12} tickMargin={8} />
        <YAxis domain={[0, 100]} unit="%" fontSize={12} tickMargin={8} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Retention Rate"]}
        />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.period} fill={getBarColor(entry.rate)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RetentionBarsChart;
