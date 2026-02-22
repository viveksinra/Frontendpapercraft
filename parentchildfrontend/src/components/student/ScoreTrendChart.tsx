'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ScoreTrendPoint {
  date: string;
  score: number;
  testTitle?: string;
}

interface ScoreTrendChartProps {
  data: ScoreTrendPoint[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Not enough data to display score trends yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
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
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
