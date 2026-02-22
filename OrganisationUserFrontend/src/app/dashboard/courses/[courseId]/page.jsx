'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Hammer,
  BarChart3,
  Users,
  Copy,
  ArrowUpCircle,
  ArrowDownCircle,
  Archive,
  Trash2,
  BookOpen,
  Clock,
  Star,
} from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getCourse,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  duplicateCourse,
  deleteCourse,
} from 'src/lib/course-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CourseStatusBadge from 'src/components/courses/CourseStatusBadge';

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
}

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourse(companyId, courseId);
      setCourse(data?.course || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(fn) {
    try {
      setError(null);
      await fn(companyId, courseId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteCourse(companyId, courseId);
      router.push(paths.dashboard.courses.root);
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  async function handleDuplicate() {
    try {
      setError(null);
      const data = await duplicateCourse(companyId, courseId);
      const newId = data?.course?._id || data?._id;
      if (newId) router.push(paths.dashboard.courses.detail(newId));
      else await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container max-w-screen-md mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      </div>
    );
  }

  const pricing = course?.pricing || {};
  const stats = course?.stats || {};
  const isDraft = course?.status === 'draft';
  const isPublished = course?.status === 'published';

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.courses.root)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{course?.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <CourseStatusBadge status={course?.status} />
              {course?.level && <Badge variant="outline">{course.level}</Badge>}
              {course?.category && <Badge variant="outline">{course.category}</Badge>}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(paths.dashboard.courses.edit(courseId))}>
            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit Metadata
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(paths.dashboard.courses.builder(courseId))}>
            <Hammer className="mr-1 h-3.5 w-3.5" /> Open Builder
          </Button>
          {isPublished && (
            <>
              <Button variant="outline" size="sm" onClick={() => router.push(paths.dashboard.courses.analytics(courseId))}>
                <BarChart3 className="mr-1 h-3.5 w-3.5" /> Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(paths.dashboard.courses.enrollments(courseId))}>
                <Users className="mr-1 h-3.5 w-3.5" /> Enrollments
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="mr-1 h-3.5 w-3.5" /> Duplicate
          </Button>
        </div>

        {/* Publishing Actions */}
        <div className="flex flex-wrap gap-2">
          {isDraft && (
            <Button size="sm" onClick={() => handleAction(publishCourse)}>
              <ArrowUpCircle className="mr-1 h-3.5 w-3.5" /> Publish
            </Button>
          )}
          {isPublished && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleAction(unpublishCourse)}>
                <ArrowDownCircle className="mr-1 h-3.5 w-3.5" /> Unpublish
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAction(archiveCourse)}>
                <Archive className="mr-1 h-3.5 w-3.5" /> Archive
              </Button>
            </>
          )}
          {isDraft && (
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
            </Button>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200 mb-2">
              Are you sure? This permanently deletes the course and all its content.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />} Yes, Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Course Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Enrollments</span>
              <span className="text-lg font-bold">{stats.enrollmentCount || 0}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Completion Rate</span>
              <span className="text-lg font-bold">{(stats.completionRate || 0).toFixed(0)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Avg Rating</span>
              <span className="text-lg font-bold">{stats.avgRating ? stats.avgRating.toFixed(1) : '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> Lessons</span>
              <span className="text-lg font-bold">{stats.totalLessons || 0}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {course?.shortDescription && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
          </div>
        )}

        {/* Pricing */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-2">Pricing</h3>
          {pricing.isFree ? (
            <span className="text-lg font-bold text-green-600 dark:text-green-400">FREE</span>
          ) : (
            <span className="text-lg font-bold">{formatPrice(pricing.basePrice, pricing.currency)}</span>
          )}
        </div>

        {/* Details */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Duration: </span>
              <span>{formatDuration(stats.totalDurationMinutes)}</span>
            </div>
            {course?.targetExamType && (
              <div>
                <span className="text-muted-foreground">Exam Type: </span>
                <span>{course.targetExamType}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Certificate: </span>
              <span>{course?.certificateEnabled ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>{new Date(course?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {course?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {course.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
