'use client';

import { Star, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function CourseReviewsList({ reviews = [], onToggleVisibility }) {
  const [toggling, setToggling] = useState(null);

  async function handleToggle(enrollmentId) {
    setToggling(enrollmentId);
    try {
      await onToggleVisibility?.(enrollmentId);
    } finally {
      setToggling(null);
    }
  }

  if (!reviews.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => {
        const id = review.enrollmentId || review._id;
        return (
          <div
            key={id}
            className={`rounded-md border p-3 ${review.isVisible === false ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{review.studentName || 'Student'}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={toggling === id}
                onClick={() => handleToggle(id)}
              >
                {toggling === id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : review.isVisible === false ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            {review.reviewText && (
              <p className="text-sm text-muted-foreground">{review.reviewText}</p>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(review.reviewedAt).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
