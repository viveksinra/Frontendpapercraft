'use client';

import { use, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseDetail } from '@/lib/course-api';
import CoursePlayer from '@/components/courses/player/CoursePlayer';

export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const { user } = useAuth();
  const companyId = user?.companyId || '';
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    async function resolveCourseId() {
      if (!companyId) return;
      try {
        const course = await getCourseDetail(companyId, courseSlug);
        setCourseId(course._id || course.id);
      } catch {
        // handled by interceptor
      }
    }
    resolveCourseId();
  }, [companyId, courseSlug]);

  if (!courseId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <CoursePlayer courseId={courseId} />;
}
