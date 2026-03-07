'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
import CourseAnalyticsDashboard from 'src/components/courses/analytics/CourseAnalyticsDashboard';

export default function CourseAnalyticsPage() {
  const { courseId } = useParams();
  const router = useRouter();

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.courses.detail(courseId))}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Course Analytics</h1>
        </div>

        <CourseAnalyticsDashboard courseId={courseId} />
      </div>
    </div>
  );
}
