'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getChildCourses } from '@/lib/course-api';
import ChildCoursesList from '@/components/parent/ChildCoursesList';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ChildCoursesPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getChildCourses(childId, { pageSize: 100 });
        setCourses(data.enrollments || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Child&apos;s Courses</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor course progress and learning activity.
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Browse Courses
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <ChildCoursesList courses={courses} childId={childId} />
      )}
    </div>
  );
}
