'use client';

import Link from 'next/link';
import { BookOpen, Clock, Users, Star } from 'lucide-react';

interface CourseCatalogCardProps {
  course: any;
  basePath?: string;
}

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours}h ${mins}m`;
}

export default function CourseCatalogCard({ course, basePath = '/student/courses' }: CourseCatalogCardProps) {
  const stats = course.stats || {};
  const pricing = course.pricing || {};
  const slug = course.slug || course._id || course.id;

  return (
    <Link href={`${basePath}/${slug}`} className="block">
      <div className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold line-clamp-2">{course.title}</h3>
          {course.teacherName && (
            <p className="text-xs text-muted-foreground">{course.teacherName}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> {stats.totalLessons || 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatDuration(stats.totalDurationMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {stats.enrollmentCount || 0}
            </span>
            {stats.avgRating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {stats.avgRating.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            {pricing.isFree ? (
              <span className="text-sm font-bold text-green-600">FREE</span>
            ) : (
              <span className="text-sm font-bold">
                {pricing.currency === 'INR' ? '₹' : '£'}{(pricing.basePrice || 0).toFixed(2)}
              </span>
            )}
            {course.level && (
              <span className="text-xs px-2 py-0.5 rounded-full border">{course.level}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
