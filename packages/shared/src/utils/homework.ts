// Phase 5 -- Shared homework utility functions

import type { SubmissionSummary, HomeworkStatus, SubmissionStatus } from "../types/class";

/**
 * Calculate submission completion percentage from a SubmissionSummary.
 */
export function getCompletionPercentage(summary: SubmissionSummary): number {
  if (summary.total === 0) return 0;
  return Math.round((summary.completed / summary.total) * 100);
}

/**
 * Check if a homework is overdue based on its due date.
 */
export function isHomeworkOverdue(dueDate: string | Date): boolean {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return due.getTime() < Date.now();
}

/**
 * Check if a homework is due soon (within 24 hours).
 */
export function isHomeworkDueSoon(dueDate: string | Date): boolean {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = Date.now();
  const diff = due.getTime() - now;
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

/**
 * Get the effective deadline for a homework, taking late submission into account.
 */
export function getEffectiveDeadline(
  dueDate: string | Date,
  lateSubmissionAllowed: boolean,
  lateDeadline: string | Date | null
): Date {
  if (lateSubmissionAllowed && lateDeadline) {
    return typeof lateDeadline === "string" ? new Date(lateDeadline) : lateDeadline;
  }
  return typeof dueDate === "string" ? new Date(dueDate) : dueDate;
}

/**
 * Determine if a student can still submit homework.
 */
export function canSubmitHomework(
  homeworkStatus: HomeworkStatus,
  submissionStatus: SubmissionStatus,
  dueDate: string | Date,
  lateSubmissionAllowed: boolean,
  lateDeadline: string | Date | null
): boolean {
  if (homeworkStatus === "archived" || homeworkStatus === "completed") return false;
  if (submissionStatus === "submitted" || submissionStatus === "graded") return false;

  const deadline = getEffectiveDeadline(dueDate, lateSubmissionAllowed, lateDeadline);
  return deadline.getTime() > Date.now();
}

/**
 * Format currency amount for display.
 */
export function formatCurrency(amount: number, currency: "GBP" | "INR"): string {
  const locale = currency === "GBP" ? "en-GB" : "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate outstanding balance from fee record fields.
 */
export function getOutstandingBalance(amount: number, amountPaid: number): number {
  return Math.max(0, amount - amountPaid);
}
