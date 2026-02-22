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

export interface EnrollmentLineChartProps {
  data: Array<{ date: string; newStudents: number; totalStudents: number }>;
  height?: number;
}

export function EnrollmentLineChart({
  data,
  height = 300,
}: EnrollmentLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No enrollment data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} tickMargin={8} />
        <YAxis yAxisId="total" fontSize={12} tickMargin={8} />
        <YAxis yAxisId="new" orientation="right" fontSize={12} tickMargin={8} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="total"
          type="monotone"
          dataKey="totalStudents"
          name="Total Students"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          yAxisId="new"
          type="monotone"
          dataKey="newStudents"
          name="New Students"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default EnrollmentLineChart;
