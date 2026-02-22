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

export interface DifficultyAnalysisBarsProps {
  easy: number;
  medium: number;
  hard: number;
  expert: number;
  height?: number;
}

const COLORS: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#f97316",
  Expert: "#ef4444",
};

export function DifficultyAnalysisBars({
  easy,
  medium,
  hard,
  expert,
  height = 250,
}: DifficultyAnalysisBarsProps) {
  const data = [
    { difficulty: "Easy", accuracy: easy },
    { difficulty: "Medium", accuracy: medium },
    { difficulty: "Hard", accuracy: hard },
    { difficulty: "Expert", accuracy: expert },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} />
        <YAxis type="category" dataKey="difficulty" fontSize={12} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Accuracy"]}
        />
        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.difficulty} fill={COLORS[entry.difficulty]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DifficultyAnalysisBars;
