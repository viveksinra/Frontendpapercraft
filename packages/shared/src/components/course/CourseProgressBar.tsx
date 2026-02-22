import React from "react";

export interface CourseProgressBarProps {
  percent: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function CourseProgressBar({ percent, showLabel = true, size = "md" }: CourseProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const barColor = clamped >= 100 ? "bg-green-500" : clamped >= 50 ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 overflow-hidden rounded-full bg-gray-200 ${sizeConfig[size]}`}>
        <div
          className={`${sizeConfig[size]} rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 tabular-nums">{clamped}%</span>
      )}
    </div>
  );
}
