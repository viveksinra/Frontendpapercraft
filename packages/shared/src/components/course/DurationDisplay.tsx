import React from "react";

export interface DurationDisplayProps {
  minutes: number;
  format?: "short" | "long";
  className?: string;
}

export function DurationDisplay({ minutes, format = "short", className = "" }: DurationDisplayProps) {
  if (minutes <= 0) {
    return <span className={`text-gray-400 ${className}`}>{format === "short" ? "0m" : "0 min"}</span>;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let text: string;
  if (format === "short") {
    text = hours > 0 ? (mins > 0 ? `${hours}h ${mins}m` : `${hours}h`) : `${mins}m`;
  } else {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (mins > 0) parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    text = parts.join(" ");
  }

  return <span className={className}>{text}</span>;
}
