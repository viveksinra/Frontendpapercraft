'use client';

import { BookOpen, Clock, Users, Star } from 'lucide-react';
import CourseRatingStars from './CourseRatingStars';

interface CourseDetailHeroProps {
  course: any;
}

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours}h ${mins}m`;
}

export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const stats = course.stats || {};

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="grid md:grid-cols-[1fr_300px] gap-0">
        <div className="p-6 flex flex-col gap-4">
          {course.level && (
            <span className="inline-flex w-fit text-xs px-2 py-0.5 rounded-full border font-medium">
              {course.level.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
          {course.subtitle && (
            <p className="text-muted-foreground">{course.subtitle}</p>
          )}
          {course.teacherName && (
            <p className="text-sm text-muted-foreground">
              By <span className="font-medium text-foreground">{course.teacherName}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {stats.totalLessons || 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {formatDuration(stats.totalDurationMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {stats.enrollmentCount || 0} students
            </span>
            {stats.avgRating > 0 && (
              <span className="flex items-center gap-1">
                <CourseRatingStars rating={stats.avgRating} size={14} showValue count={stats.reviewCount} />
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center min-h-[200px]">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
