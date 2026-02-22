import React from "react";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-blue-100", text: "text-blue-700" },
  completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700" },
  dropped: { label: "Dropped", bg: "bg-gray-100", text: "text-gray-600" },
};

export interface EnrollmentStatusBadgeProps {
  status: string;
  className?: string;
}

export function EnrollmentStatusBadge({ status, className = "" }: EnrollmentStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
}
