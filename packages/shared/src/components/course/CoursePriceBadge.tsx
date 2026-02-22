import React from "react";

export interface CoursePriceBadgeProps {
  isFree: boolean;
  price: number;
  currency: string;
  className?: string;
}

export function CoursePriceBadge({ isFree, price, currency, className = "" }: CoursePriceBadgeProps) {
  if (isFree) {
    return (
      <span className={`inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ${className}`}>
        FREE
      </span>
    );
  }

  const symbol = currency === "INR" ? "\u20B9" : "\u00A3";
  return (
    <span className={`text-sm font-semibold text-gray-900 ${className}`}>
      {symbol}{price.toFixed(2)}
    </span>
  );
}
