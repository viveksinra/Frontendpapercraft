'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DifficultyLevel {
  difficulty: string;
  correct: number;
  total: number;
  percentage: number;
}

interface DifficultyAnalysisChartProps {
  data: DifficultyLevel[];
}

const COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#3b82f6',
  hard: '#f59e0b',
  very_hard: '#ef4444',
};

export function DifficultyAnalysisChart({ data }: DifficultyAnalysisChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Difficulty Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No difficulty data available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Difficulty Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="difficulty"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, _name: string, entry: any) => [
                `${value.toFixed(1)}% (${entry.payload.correct}/${entry.payload.total})`,
                'Accuracy',
              ]}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell
                  key={entry.difficulty}
                  fill={COLORS[entry.difficulty.toLowerCase()] || '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
