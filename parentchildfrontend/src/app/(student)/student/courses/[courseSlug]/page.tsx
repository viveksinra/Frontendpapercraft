'use client';

import { use, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseDetail, getMyEnrollments } from '@/lib/course-api';
import CourseDetailHero from '@/components/courses/CourseDetailHero';
import CourseCurriculum from '@/components/courses/CourseCurriculum';
import CourseInstructorCard from '@/components/courses/CourseInstructorCard';
import CourseReviewsList from '@/components/courses/CourseReviewsList';
import CourseEnrollButton from '@/components/courses/CourseEnrollButton';
import CourseRatingForm from '@/components/courses/CourseRatingForm';
import FreePreviewPlayer from '@/components/courses/FreePreviewPlayer';
import { Loader2, AlertCircle } from 'lucide-react';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!companyId) return;
      setLoading(true);
      try {
        const [courseData, enrollments] = await Promise.all([
          getCourseDetail(companyId, courseSlug),
          getMyEnrollments({ pageSize: 200 }).catch(() => ({ enrollments: [] })),
        ]);
        setCourse(courseData);
        const courseId = courseData._id || courseData.id;
        const enrolled = (enrollments.enrollments || []).some(
          (e: any) => (e.courseId === courseId || e.course?._id === courseId) && e.status === 'active'
        );
        setIsEnrolled(enrolled);
      } catch (err: any) {
        setError(err.message || 'Failed to load course.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId, courseSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="mt-3 text-sm text-destructive">{error || 'Course not found.'}</p>
      </div>
    );
  }

  if (previewLesson) {
    return (
      <FreePreviewPlayer
        lesson={previewLesson}
        courseSlug={courseSlug}
        onClose={() => setPreviewLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CourseDetailHero course={course} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {course.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">About this Course</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {course.description}
              </p>
            </div>
          )}

          <CourseCurriculum
            sections={course.sections || []}
            isEnrolled={isEnrolled}
            onFreePreview={(lesson) => setPreviewLesson(lesson)}
          />

          {isEnrolled && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Your Review</h2>
              <CourseRatingForm
                courseId={course._id || course.id}
                existingReview={course.myReview}
              />
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Reviews</h2>
            <CourseReviewsList companyId={companyId} courseSlug={courseSlug} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-4 sticky top-20">
            <CourseEnrollButton
              course={course}
              isEnrolled={isEnrolled}
              courseSlug={courseSlug}
              onEnrolled={() => setIsEnrolled(true)}
            />
            {course.welcomeMessage && isEnrolled && (
              <p className="text-xs text-muted-foreground">{course.welcomeMessage}</p>
            )}
          </div>
          <CourseInstructorCard course={course} />
        </div>
      </div>
    </div>
  );
}
