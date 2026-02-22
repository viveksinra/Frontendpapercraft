import React from "react";
import type { ProductPricing } from "../../types/payment";

// ─── Props ─────────────────────────────────────────────────────────────────

export interface PriceBadgeProps {
  pricing: ProductPricing;
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getCurrencySymbol(currency: string): string {
  return currency === "INR" ? "\u20B9" : "\u00A3"; // ₹ or £
}

function isDiscountActive(pricing: ProductPricing): boolean {
  if (pricing.discountPrice == null || !pricing.discountValidUntil) return false;
  return new Date(pricing.discountValidUntil) > new Date();
}

// ─── Component ─────────────────────────────────────────────────────────────

export function PriceBadge({ pricing, className = "" }: PriceBadgeProps) {
  const symbol = getCurrencySymbol(pricing.currency);

  // Free product
  if (pricing.isFree) {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 ${className}`}
      >
        FREE
      </span>
    );
  }

  // Active discount
  if (isDiscountActive(pricing)) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-xs text-muted-foreground line-through">
          {symbol}
          {pricing.basePrice.toFixed(2)}
        </span>
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          {symbol}
          {pricing.discountPrice!.toFixed(2)}
        </span>
      </span>
    );
  }

  // Regular price
  return (
    <span
      className={`inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 ${className}`}
    >
      {symbol}
      {pricing.basePrice.toFixed(2)}
    </span>
  );
}

export default PriceBadge;
