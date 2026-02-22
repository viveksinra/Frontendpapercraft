import React from "react";

const levelConfig: Record<string, { label: string; bg: string; text: string }> = {
  beginner: { label: "Beginner", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-yellow-100", text: "text-yellow-700" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
  all_levels: { label: "All Levels", bg: "bg-blue-100", text: "text-blue-700" },
};

export interface CourseLevelBadgeProps {
  level: string;
  className?: string;
}

export function CourseLevelBadge({ level, className = "" }: CourseLevelBadgeProps) {
  const config = levelConfig[level] || levelConfig.all_levels;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
}
