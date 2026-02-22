import type { ProductPricing } from "../types/payment";

/**
 * Returns the effective price for a product based on active discounts.
 * Returns 0 for free products, discountPrice if active, else basePrice.
 */
export function getEffectivePrice(pricing: ProductPricing): number {
  if (pricing.isFree) return 0;

  if (isDiscountActive(pricing)) {
    return pricing.discountPrice!;
  }

  return pricing.basePrice;
}

/**
 * Formats a price amount with the correct currency symbol.
 * e.g. formatPrice(30, "GBP") => "£30.00"
 */
export function formatPrice(amount: number, currency: string): string {
  const symbol = currency === "INR" ? "\u20B9" : "\u00A3"; // ₹ or £
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Returns the discount percentage if a discount is active, null otherwise.
 */
export function getDiscountPercentage(pricing: ProductPricing): number | null {
  if (!isDiscountActive(pricing) || pricing.discountPrice == null) return null;
  if (pricing.basePrice === 0) return null;

  return Math.round(((pricing.basePrice - pricing.discountPrice) / pricing.basePrice) * 100);
}

/**
 * Checks whether a discount is currently active (set and not expired).
 */
export function isDiscountActive(pricing: ProductPricing): boolean {
  if (pricing.discountPrice == null || !pricing.discountValidUntil) return false;
  return new Date(pricing.discountValidUntil) > new Date();
}
