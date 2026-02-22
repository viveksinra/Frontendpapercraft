import React from "react";

export interface TopicHeatmapChartProps {
  students: string[];
  topics: string[];
  /** data[studentName][topicName] = percentage (0-100) */
  data: Record<string, Record<string, number>>;
  colorScale?: { low: string; mid: string; high: string };
}

function getCellColor(
  value: number | undefined,
  scale: { low: string; mid: string; high: string }
): string {
  if (value == null) return "#f3f4f6"; // gray-100
  if (value >= 80) return scale.high;
  if (value >= 50) return scale.mid;
  return scale.low;
}

function getCellTextColor(value: number | undefined): string {
  if (value == null) return "#9ca3af";
  if (value >= 80) return "#ffffff";
  if (value >= 50) return "#1f2937";
  return "#ffffff";
}

export function TopicHeatmapChart({
  students,
  topics,
  data,
  colorScale = { low: "#ef4444", mid: "#eab308", high: "#22c55e" },
}: TopicHeatmapChartProps) {
  if (students.length === 0 || topics.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground py-8">
        No heatmap data available
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background p-2 text-left font-medium text-muted-foreground border">
              Student
            </th>
            {topics.map((topic) => (
              <th
                key={topic}
                className="p-2 text-center font-medium text-muted-foreground border whitespace-nowrap"
              >
                {topic}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student}>
              <td className="sticky left-0 bg-background p-2 font-medium border whitespace-nowrap">
                {student}
              </td>
              {topics.map((topic) => {
                const value = data[student]?.[topic];
                return (
                  <td
                    key={topic}
                    className="p-2 text-center border font-semibold tabular-nums"
                    style={{
                      backgroundColor: getCellColor(value, colorScale),
                      color: getCellTextColor(value),
                    }}
                    title={value != null ? `${student} — ${topic}: ${value.toFixed(1)}%` : "N/A"}
                  >
                    {value != null ? `${Math.round(value)}%` : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: colorScale.high }} />
          <span>80%+</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: colorScale.mid }} />
          <span>50–79%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: colorScale.low }} />
          <span>&lt;50%</span>
        </div>
      </div>
    </div>
  );
}

export default TopicHeatmapChart;
