import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface SubjectRadarChartProps {
  data: Array<{ subject: string; studentAvg: number; classAvg?: number }>;
  height?: number;
}

export function SubjectRadarChart({
  data,
  height = 350,
}: SubjectRadarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No subject data available
      </div>
    );
  }

  const hasClassAvg = data.some((d) => d.classAvg != null);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" fontSize={12} />
        <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
        <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`]} />
        <Legend />
        <Radar
          name="Student"
          dataKey="studentAvg"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.2}
        />
        {hasClassAvg && (
          <Radar
            name="Class Average"
            dataKey="classAvg"
            stroke="#9ca3af"
            fill="#9ca3af"
            fillOpacity={0.1}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default SubjectRadarChart;
