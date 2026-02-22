'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getCourseAnalytics, getCourseReviews, toggleReviewVisibility } from 'src/lib/course-api';

import CourseKPICards from './CourseKPICards';
import CompletionFunnelChart from './CompletionFunnelChart';
import RatingDistributionChart from './RatingDistributionChart';
import CourseReviewsList from './CourseReviewsList';

export default function CourseAnalyticsDashboard({ courseId }) {
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [reviews, setReviews] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsData, reviewsData] = await Promise.all([
        getCourseAnalytics(companyId, courseId),
        getCourseReviews(companyId, courseId),
      ]);
      setAnalytics(analyticsData?.analytics || analyticsData);
      setReviews(reviewsData?.reviews || reviewsData || []);
    } catch {
      // silent fail, show empty
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId]);

  useEffect(() => { load(); }, [load]);

  async function handleToggleVisibility(enrollmentId) {
    try {
      await toggleReviewVisibility(companyId, courseId, enrollmentId);
      await load();
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <CourseKPICards analytics={analytics} />

      {/* Completion Funnel */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Lesson Completion Funnel</h3>
        <CompletionFunnelChart lessonStats={analytics?.lessonStats || []} />
      </div>

      {/* Rating Distribution */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Rating Distribution</h3>
        <RatingDistributionChart distribution={analytics?.ratingDistribution || {}} />
      </div>

      {/* Reviews */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Reviews</h3>
        <CourseReviewsList reviews={reviews} onToggleVisibility={handleToggleVisibility} />
      </div>
    </div>
  );
}
