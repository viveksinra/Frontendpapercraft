'use client';

import { Star } from 'lucide-react';

interface CourseRatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export default function CourseRatingStars({
  rating,
  size = 16,
  showValue = false,
  count,
}: CourseRatingStarsProps) {
  const full = Math.floor(rating);
  const partial = rating - full;

  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= full) {
          return (
            <Star
              key={i}
              className="fill-yellow-400 text-yellow-400"
              style={{ width: size, height: size }}
            />
          );
        }
        if (i === full + 1 && partial > 0) {
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute text-muted-foreground/30" style={{ width: size, height: size }} />
              <span className="absolute overflow-hidden" style={{ width: `${partial * 100}%` }}>
                <Star className="fill-yellow-400 text-yellow-400" style={{ width: size, height: size }} />
              </span>
            </span>
          );
        }
        return (
          <Star
            key={i}
            className="text-muted-foreground/30"
            style={{ width: size, height: size }}
          />
        );
      })}
      {showValue && <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>}
      {count !== undefined && (
        <span className="ml-1 text-xs text-muted-foreground">({count})</span>
      )}
    </span>
  );
}
