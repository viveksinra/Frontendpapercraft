'use client';

import Link from 'next/link';
import { BookOpen, Clock, Award } from 'lucide-react';
import ProgressBar from '../courses/player/ProgressBar';

interface ChildCoursesListProps {
  courses: any[];
  childId: string;
}

export default function ChildCoursesList({ courses, childId }: ChildCoursesListProps) {
  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center">
        <BookOpen className="h-10 w-10 mb-3 text-muted-foreground/40" />
        <p className="text-sm">No courses enrolled yet.</p>
        <Link
          href="/courses"
          className="mt-3 text-sm text-primary hover:underline"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((enrollment: any) => {
        const course = enrollment.course || {};
        const progress = enrollment.progressPercentage || 0;
        const isCompleted = enrollment.status === 'completed' || progress >= 100;
        const lastActivity = enrollment.lastAccessedAt
          ? new Date(enrollment.lastAccessedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })
          : null;

        return (
          <div key={enrollment._id} className="rounded-lg border bg-card p-4">
            <div className="flex gap-4">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-14 rounded object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                <ProgressBar percentage={progress} />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {enrollment.completedLessonCount || 0}/{enrollment.totalLessonCount || 0} lessons
                  </span>
                  {enrollment.totalTimeSpentMinutes > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {enrollment.totalTimeSpentMinutes} min
                    </span>
                  )}
                  {lastActivity && <span>Last: {lastActivity}</span>}
                  {isCompleted && (
                    <span className="text-green-600 flex items-center gap-1">
                      <Award className="h-3 w-3" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
