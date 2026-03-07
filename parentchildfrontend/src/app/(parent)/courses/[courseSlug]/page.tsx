'use client';

import { use, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseDetail } from '@/lib/course-api';
import { getChildren } from '@/lib/parent-api';
import CourseDetailHero from '@/components/courses/CourseDetailHero';
import CourseCurriculum from '@/components/courses/CourseCurriculum';
import CourseInstructorCard from '@/components/courses/CourseInstructorCard';
import CourseReviewsList from '@/components/courses/CourseReviewsList';
import CourseEnrollButton from '@/components/courses/CourseEnrollButton';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ParentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  const [course, setCourse] = useState<any>(null);
  const [linkedChildren, setLinkedChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!companyId) return;
      setLoading(true);
      try {
        const [courseData, childrenData] = await Promise.all([
          getCourseDetail(companyId, courseSlug),
          getChildren().catch(() => ({ children: [] })),
        ]);
        setCourse(courseData);
        setLinkedChildren(childrenData.children || childrenData || []);
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
          <CourseCurriculum sections={course.sections || []} isEnrolled={false} />
          <div>
            <h2 className="text-lg font-semibold mb-3">Reviews</h2>
            <CourseReviewsList companyId={companyId} courseSlug={courseSlug} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-4 sticky top-20">
            <CourseEnrollButton
              course={course}
              isEnrolled={false}
              courseSlug={courseSlug}
              isParent
              linkedChildren={linkedChildren}
            />
          </div>
          <CourseInstructorCard course={course} />
        </div>
      </div>
    </div>
  );
}
