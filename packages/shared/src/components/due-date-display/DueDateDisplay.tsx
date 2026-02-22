import React from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getRelativeTime(dueDate: Date): { label: string; urgency: "overdue" | "urgent" | "soon" | "normal" } {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) {
    const absDays = Math.abs(Math.floor(diffDays));
    if (absDays === 0) return { label: "Overdue (today)", urgency: "overdue" };
    if (absDays === 1) return { label: "Overdue by 1 day", urgency: "overdue" };
    return { label: `Overdue by ${absDays} days`, urgency: "overdue" };
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    if (hours === 0) return { label: "Due within the hour", urgency: "urgent" };
    if (hours === 1) return { label: "Due in 1 hour", urgency: "urgent" };
    return { label: `Due in ${hours} hours`, urgency: "urgent" };
  }

  const days = Math.floor(diffDays);
  if (days === 1) return { label: "Due tomorrow", urgency: "soon" };
  if (days <= 3) return { label: `Due in ${days} days`, urgency: "soon" };
  if (days <= 7) return { label: `Due in ${days} days`, urgency: "normal" };

  return { label: `Due in ${days} days`, urgency: "normal" };
}

const URGENCY_STYLES = {
  overdue: "text-red-600 dark:text-red-400",
  urgent: "text-orange-600 dark:text-orange-400",
  soon: "text-yellow-600 dark:text-yellow-400",
  normal: "text-muted-foreground",
};

// ─── Props ─────────────────────────────────────────────────────────────────

export interface DueDateDisplayProps {
  dueDate: string | Date;
  showRelative?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function DueDateDisplay({
  dueDate,
  showRelative = true,
  className = "",
}: DueDateDisplayProps) {
  const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!showRelative) {
    return <span className={`text-sm ${className}`}>{formatted}</span>;
  }

  const { label, urgency } = getRelativeTime(date);
  const color = URGENCY_STYLES[urgency];

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="text-sm">{formatted}</span>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </span>
  );
}

export default DueDateDisplay;
