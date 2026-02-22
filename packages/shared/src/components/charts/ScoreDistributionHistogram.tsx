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

export interface ScoreDistributionHistogramProps {
  data: Array<{ bucket: string; count: number }>;
  height?: number;
  highlightBucket?: string;
}

export function ScoreDistributionHistogram({
  data,
  height = 300,
  highlightBucket,
}: ScoreDistributionHistogramProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No distribution data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="bucket" fontSize={12} tickMargin={8} />
        <YAxis fontSize={12} tickMargin={8} allowDecimals={false} />
        <Tooltip
          formatter={(value: number) => [`${value} students`, "Count"]}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.bucket}
              fill={entry.bucket === highlightBucket ? "#2563eb" : "#93c5fd"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ScoreDistributionHistogram;
