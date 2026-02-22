import React from "react";
import type { FeeStatus } from "../../types/class";

// ─── Fee status colours ────────────────────────────────────────────────────

const FEE_STATUS_STYLES: Record<FeeStatus, string> = {
  unpaid:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  partial:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  paid:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
};

const FEE_STATUS_LABELS: Record<FeeStatus, string> = {
  unpaid: "Unpaid",
  partial: "Partial",
  paid: "Paid",
};

// ─── Props ─────────────────────────────────────────────────────────────────

export interface FeeStatusBadgeProps {
  status: FeeStatus;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function FeeStatusBadge({ status, className = "" }: FeeStatusBadgeProps) {
  const styles = FEE_STATUS_STYLES[status];
  const label = FEE_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles ?? ""} ${className}`}
    >
      {label ?? status}
    </span>
  );
}

export default FeeStatusBadge;
