'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Plus } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  listCourses,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  duplicateCourse,
  deleteCourse,
} from 'src/lib/course-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import CourseList from 'src/components/courses/CourseList';

// ─────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

export default function CoursesListPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCourses = useCallback(async () => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = { page, pageSize: 20 };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await listCourses(activeCompanyId, params);
      setCourses(data?.courses || data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, statusFilter, searchQuery, page]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  async function handleAction(action, courseId) {
    try {
      setError(null);
      await action(activeCompanyId, courseId);
      await loadCourses();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
            <p className="text-sm text-muted-foreground">
              Build and manage your course catalog.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.courses.create)}>
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                statusFilter === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <CourseList
              courses={courses}
              onPublish={(id) => handleAction(publishCourse, id)}
              onUnpublish={(id) => handleAction(unpublishCourse, id)}
              onArchive={(id) => handleAction(archiveCourse, id)}
              onDuplicate={(id) => handleAction(duplicateCourse, id)}
              onDelete={(id) => handleAction(deleteCourse, id)}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
