import React from "react";
import type { HomeworkStatus, SubmissionStatus } from "../../types/class";

// ─── Homework status colours ───────────────────────────────────────────────

const HW_STATUS_STYLES: Record<HomeworkStatus, string> = {
  active:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  past_due:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  completed:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  archived:
    "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
};

const HW_STATUS_LABELS: Record<HomeworkStatus, string> = {
  active: "Active",
  past_due: "Past Due",
  completed: "Completed",
  archived: "Archived",
};

// ─── Submission status colours ─────────────────────────────────────────────

const SUB_STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  submitted:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  late:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  graded:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
};

const SUB_STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  late: "Late",
  graded: "Graded",
};

// ─── Props ─────────────────────────────────────────────────────────────────

export interface HomeworkStatusBadgeProps {
  status: HomeworkStatus | SubmissionStatus;
  variant?: "homework" | "submission";
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function HomeworkStatusBadge({
  status,
  variant = "homework",
  className = "",
}: HomeworkStatusBadgeProps) {
  const styles =
    variant === "submission"
      ? SUB_STATUS_STYLES[status as SubmissionStatus]
      : HW_STATUS_STYLES[status as HomeworkStatus];

  const label =
    variant === "submission"
      ? SUB_STATUS_LABELS[status as SubmissionStatus]
      : HW_STATUS_LABELS[status as HomeworkStatus];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles ?? ""} ${className}`}
    >
      {label ?? status}
    </span>
  );
}

export default HomeworkStatusBadge;
