'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { browseCourses } from '@/lib/course-api';
import CourseCatalogFilters from '@/components/courses/CourseCatalogFilters';
import CourseCatalogGrid from '@/components/courses/CourseCatalogGrid';
import { Loader2, AlertCircle } from 'lucide-react';

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    isFree: '',
    search: '',
    sort: 'popular',
  });

  const fetchCourses = useCallback(async () => {
    if (!companyId) {
      setLoading(false);
      setCourses([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.level) params.level = filters.level;
      if (filters.isFree) params.isFree = filters.isFree === 'true';
      if (filters.sort) params.sort = filters.sort;
      if (filters.category) params.category = filters.category;

      const data = await browseCourses(companyId, params);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }, [companyId, page, filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  function handleFilterChange(newFilters: any) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and enroll in courses from your institute.
        </p>
      </div>

      <CourseCatalogFilters filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm rounded-md border"
            onClick={fetchCourses}
          >
            Try Again
          </button>
        </div>
      ) : (
        <CourseCatalogGrid
          courses={courses}
          basePath="/student/courses"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
