'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getCourseEnrollments } from 'src/lib/course-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS = {
  active: 'default',
  completed: 'secondary',
  dropped: 'destructive',
};

export default function CourseEnrollmentTable({ courseId }) {
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, pageSize: 20 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const data = await getCourseEnrollments(companyId, courseId, params);
      setEnrollments(data?.enrollments || data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId, search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : enrollments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No enrollments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">Student</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-right py-2 px-3 font-medium">Progress</th>
                <th className="text-right py-2 px-3 font-medium">Time Spent</th>
                <th className="text-right py-2 px-3 font-medium">Enrolled</th>
                <th className="text-right py-2 px-3 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => {
                const id = e._id || e.id;
                const progress = e.progress || {};
                return (
                  <tr key={id} className="border-b hover:bg-accent/50">
                    <td className="py-2 px-3">
                      <div className="font-medium">{e.studentName || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">{e.studentEmail || ''}</div>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant={STATUS_COLORS[e.status] || 'secondary'}>{e.status}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right">{(progress.percentComplete || 0).toFixed(0)}%</td>
                    <td className="py-2 px-3 text-right">{Math.round((progress.totalTimeSpentSeconds || 0) / 60)} min</td>
                    <td className="py-2 px-3 text-right">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td className="py-2 px-3 text-right">
                      {progress.lastAccessedAt
                        ? new Date(progress.lastAccessedAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
