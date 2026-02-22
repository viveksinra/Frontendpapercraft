'use client';

import CourseRatingStars from './CourseRatingStars';

interface CourseReviewCardProps {
  review: any;
}

export default function CourseReviewCard({ review }: CourseReviewCardProps) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
            {(review.studentName || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{review.studentName || 'Student'}</p>
            {date && <p className="text-xs text-muted-foreground">{date}</p>}
          </div>
        </div>
        <CourseRatingStars rating={review.rating || 0} size={14} />
      </div>
      {review.reviewText && (
        <p className="text-sm text-muted-foreground">{review.reviewText}</p>
      )}
    </div>
  );
}
