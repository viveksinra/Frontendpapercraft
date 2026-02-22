'use client';

import { useState } from 'react';
import { rateCourse, updateRating } from '@/lib/course-api';
import { Star, Loader2 } from 'lucide-react';

interface CourseRatingFormProps {
  courseId: string;
  existingReview?: { rating: number; reviewText?: string } | null;
}

export default function CourseRatingForm({ courseId, existingReview }: CourseRatingFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      if (existingReview) {
        await updateRating(courseId, { rating, reviewText: reviewText || undefined });
      } else {
        await rateCourse(courseId, { rating, reviewText: reviewText || undefined });
      }
      setSubmitted(true);
    } catch {
      // error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-green-600 font-medium">Thank you for your review!</p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className="p-0.5"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
        )}
      </div>
      <div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write a review (optional)..."
          maxLength={2000}
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{reviewText.length}/2000</p>
      </div>
      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
        ) : existingReview ? (
          'Update Review'
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
