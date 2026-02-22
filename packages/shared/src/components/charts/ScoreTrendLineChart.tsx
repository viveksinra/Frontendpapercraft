import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface ScoreTrendLineChartProps {
  data: Array<{ date: string; score: number; classAvg?: number }>;
  height?: number;
  showClassAvg?: boolean;
}

export function ScoreTrendLineChart({
  data,
  height = 300,
  showClassAvg = false,
}: ScoreTrendLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No score data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} tickMargin={8} />
        <YAxis domain={[0, 100]} fontSize={12} tickMargin={8} unit="%" />
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value.toFixed(1)}%`,
            name === "score" ? "Student Score" : "Class Average",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          name="Student Score"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {showClassAvg && (
          <Line
            type="monotone"
            dataKey="classAvg"
            name="Class Average"
            stroke="#9ca3af"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ScoreTrendLineChart;
