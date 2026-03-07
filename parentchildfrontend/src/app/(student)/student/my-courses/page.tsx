'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMyEnrollments } from '@/lib/course-api';
import MyCoursesList from '@/components/courses/my-courses/MyCoursesList';
import { Loader2, AlertCircle } from 'lucide-react';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEnrollments({ pageSize: 100 });
      setEnrollments(data.enrollments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const filtered = enrollments.filter((e) => {
    if (tab === 'in_progress') return e.status === 'active' && (e.progressPercentage || 0) < 100;
    if (tab === 'completed') return e.status === 'completed' || (e.progressPercentage || 0) >= 100;
    return true;
  });

  const tabs = [
    { key: 'all' as const, label: 'All' },
    { key: 'in_progress' as const, label: 'In Progress' },
    { key: 'completed' as const, label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Track your progress and continue learning.
        </p>
      </div>

      <div className="flex gap-1 border-b" role="tablist" aria-label="Course filters">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
          <button type="button" className="mt-4 px-4 py-2 text-sm rounded-md border" onClick={fetchEnrollments}>
            Try Again
          </button>
        </div>
      ) : (
        <MyCoursesList enrollments={filtered} />
      )}
    </div>
  );
}
