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

export interface TimeAnalysisChartProps {
  data: Array<{ date: string; avgTime: number; classAvgTime?: number }>;
  height?: number;
}

export function TimeAnalysisChart({
  data,
  height = 300,
}: TimeAnalysisChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No time analysis data available
      </div>
    );
  }

  const hasClassAvg = data.some((d) => d.classAvgTime != null);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} tickMargin={8} />
        <YAxis fontSize={12} tickMargin={8} unit="s" />
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value.toFixed(1)}s`,
            name === "avgTime" ? "Avg Time/Question" : "Class Avg Time",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="avgTime"
          name="Avg Time/Question"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {hasClassAvg && (
          <Line
            type="monotone"
            dataKey="classAvgTime"
            name="Class Avg Time"
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

export default TimeAnalysisChart;
