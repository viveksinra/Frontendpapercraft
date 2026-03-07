'use client';

import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { getCourse } from 'src/lib/course-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Button } from '@/components/ui/button';
import CoursePreview from 'src/components/courses/builder/CoursePreview';
import PublishValidation from 'src/components/courses/builder/PublishValidation';

export default function CoursePreviewPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getCourse(companyId, courseId);
      setCourse(data?.course || data);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(paths.dashboard.courses.builder(courseId))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Student Preview</h1>
        </div>

        {course?.status === 'draft' && <PublishValidation course={course} />}
        <CoursePreview course={course} />
      </div>
    </div>
  );
}
