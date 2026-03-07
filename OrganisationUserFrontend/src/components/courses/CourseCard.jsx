'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  Copy,
  Star,
  Clock,
  Pencil,
  Hammer,
  Trash2,
  Archive,
  BookOpen,
  BarChart3,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
  Users as UsersIcon,
} from 'lucide-react';

import { paths } from 'src/routes/paths';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CourseStatusBadge from './CourseStatusBadge';

function formatPrice(amount, currency = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
}

export default function CourseCard({
  course,
  onPublish,
  onUnpublish,
  onArchive,
  onDuplicate,
  onDelete,
}) {
  const router = useRouter();
  const id = course._id || course.id;
  const pricing = course.pricing || {};
  const stats = course.stats || {};
  const isDraft = course.status === 'draft';
  const isPublished = course.status === 'published';

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
      {/* Thumbnail + Title */}
      <div className="flex gap-3">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-20 h-14 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-14 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className="font-semibold truncate">{course.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <CourseStatusBadge status={course.status} />
            {course.level && (
              <Badge variant="outline" className="text-xs">{course.level}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {stats.totalLessons || 0} lessons
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(stats.totalDurationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <UsersIcon className="h-3 w-3" />
          {stats.enrollmentCount || 0}
        </span>
        {stats.avgRating > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {stats.avgRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="text-sm">
        {pricing.isFree ? (
          <span className="font-medium text-green-600 dark:text-green-400">FREE</span>
        ) : (
          <span className="font-medium">
            {formatPrice(pricing.basePrice, pricing.currency)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(paths.dashboard.courses.detail(id))}
        >
          <Eye className="mr-1 h-3.5 w-3.5" /> View
        </Button>
        {isDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(paths.dashboard.courses.builder(id))}
          >
            <Hammer className="mr-1 h-3.5 w-3.5" /> Builder
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(paths.dashboard.courses.edit(id))}
        >
          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
        </Button>
        {isPublished && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(paths.dashboard.courses.analytics(id))}
          >
            <BarChart3 className="mr-1 h-3.5 w-3.5" /> Analytics
          </Button>
        )}

        {/* More menu */}
        <div className="relative ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="More options"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-40 rounded-md border bg-popover p-1 shadow-md">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => { setMenuOpen(false); onDuplicate?.(id); }}
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              {isDraft && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => { setMenuOpen(false); onPublish?.(id); }}
                >
                  <ArrowUpCircle className="h-3.5 w-3.5" /> Publish
                </button>
              )}
              {isPublished && (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => { setMenuOpen(false); onUnpublish?.(id); }}
                  >
                    <ArrowDownCircle className="h-3.5 w-3.5" /> Unpublish
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => { setMenuOpen(false); onArchive?.(id); }}
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </button>
                </>
              )}
              {isDraft && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-accent"
                  onClick={() => { setMenuOpen(false); onDelete?.(id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
