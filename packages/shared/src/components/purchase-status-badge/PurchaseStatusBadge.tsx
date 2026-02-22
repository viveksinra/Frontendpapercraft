import React from "react";
import type { PurchaseStatus } from "../../types/payment";

// ─── Status styles ────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PurchaseStatus, string> = {
  completed:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  failed:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  refunded:
    "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
  expired:
    "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-500 dark:border-gray-700",
};

const STATUS_LABELS: Record<PurchaseStatus, string> = {
  completed: "Purchased",
  pending: "Processing",
  failed: "Failed",
  refunded: "Refunded",
  expired: "Expired",
};

// ─── Props ─────────────────────────────────────────────────────────────────

export interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function PurchaseStatusBadge({ status, className = "" }: PurchaseStatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles ?? ""} ${className}`}
    >
      {label ?? status}
    </span>
  );
}

export default PurchaseStatusBadge;
