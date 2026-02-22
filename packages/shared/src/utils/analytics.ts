/**
 * Returns the color associated with an 11+ qualification band.
 */
export function getQualificationBandColor(band: string | null): string {
  if (!band) return "#6b7280"; // gray-500
  switch (band) {
    case "Strong Pass":
      return "#16a34a"; // green-600
    case "Pass":
      return "#2563eb"; // blue-600
    case "Borderline":
      return "#d97706"; // amber-600
    case "Below":
      return "#dc2626"; // red-600
    default:
      return "#6b7280"; // gray-500
  }
}

/**
 * Formats a percentile rank as a human-readable label.
 */
export function formatPercentile(percentile: number): string {
  if (percentile >= 95) return "Top 5%";
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Top 50%";
  return "Bottom 50%";
}

/**
 * Returns a human-readable label for an improvement rate.
 */
export function getImprovementLabel(rate: number): string {
  if (rate === 0) return "No change";
  if (rate > 0) return `+${rate.toFixed(1)}% improvement`;
  return `${rate.toFixed(1)}% decline`;
}

/**
 * Returns a trend direction based on a numeric trend value.
 */
export function getTrendArrow(trend: number): "up" | "down" | "flat" {
  if (trend > 0.5) return "up";
  if (trend < -0.5) return "down";
  return "flat";
}
