'use client';

import Link from 'next/link';
import { BookOpen, Clock, Award } from 'lucide-react';
import ContinueLearningButton from './ContinueLearningButton';
import ProgressBar from '../player/ProgressBar';

interface MyCourseCardProps {
  enrollment: any;
}

export default function MyCourseCard({ enrollment }: MyCourseCardProps) {
  const course = enrollment.course || {};
  const slug = course.slug || course._id || enrollment.courseId;
  const progress = enrollment.progressPercentage || 0;
  const completedLessons = enrollment.completedLessonCount || 0;
  const totalLessons = enrollment.totalLessonCount || course.stats?.totalLessons || 0;
  const isCompleted = enrollment.status === 'completed' || progress >= 100;
  const lastActivity = enrollment.lastAccessedAt
    ? new Date(enrollment.lastAccessedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <div className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {course.thumbnail ? (
        <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-muted flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-sm line-clamp-2">{course.title}</h3>
        {course.teacherName && (
          <p className="text-xs text-muted-foreground">{course.teacherName}</p>
        )}
        <ProgressBar percentage={progress} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedLessons}/{totalLessons} lessons</span>
          {lastActivity && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {lastActivity}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          {isCompleted ? (
            <>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <Award className="h-3.5 w-3.5" /> Completed
              </span>
              {enrollment.certificateId && (
                <Link
                  href="/student/certificates"
                  className="text-xs text-primary hover:underline"
                >
                  View Certificate
                </Link>
              )}
            </>
          ) : (
            <ContinueLearningButton courseSlug={slug} />
          )}
        </div>
      </div>
    </div>
  );
}
