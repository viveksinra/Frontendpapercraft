'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SubjectScore {
  subject: string;
  percentage: number;
}

interface SubjectRadarChartProps {
  data: SubjectScore[];
}

export function SubjectRadarChart({ data }: SubjectRadarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No subject data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subject Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
            />
            <Radar
              name="Score"
              dataKey="percentage"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
