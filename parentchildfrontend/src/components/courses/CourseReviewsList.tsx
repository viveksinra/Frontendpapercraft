'use client';

import { useState, useEffect } from 'react';
import { getCourseReviews } from '@/lib/course-api';
import CourseReviewCard from './CourseReviewCard';
import { Loader2 } from 'lucide-react';

interface CourseReviewsListProps {
  companyId: string;
  courseSlug: string;
}

export default function CourseReviewsList({ companyId, courseSlug }: CourseReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCourseReviews(companyId, courseSlug, { page, limit: 5 });
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId, courseSlug, page]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!reviews.length) {
    return <p className="text-sm text-muted-foreground py-4">No reviews yet.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review, i) => (
        <CourseReviewCard key={review._id || i} review={review} />
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
