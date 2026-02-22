'use client';

import { useState, useEffect } from 'react';
import { getChildCourseProgress } from '@/lib/course-api';
import ProgressBar from '../courses/player/ProgressBar';
import { Loader2, BookOpen, Clock, Award, Check } from 'lucide-react';

interface ChildCourseProgressProps {
  childId: string;
  courseId: string;
}

export default function ChildCourseProgress({ childId, courseId }: ChildCourseProgressProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getChildCourseProgress(childId, courseId);
        setData(result);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId, courseId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const sections = data.sections || [];
  const progress = data.progressPercentage || 0;

  return (
    <div className="space-y-4">
      <ProgressBar percentage={progress} />

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {data.completedLessonCount || 0}/{data.totalLessonCount || 0} lessons
        </span>
        {data.totalTimeSpentMinutes > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {data.totalTimeSpentMinutes} min
          </span>
        )}
      </div>

      <div className="space-y-2">
        {sections.map((section: any, i: number) => (
          <div key={i} className="rounded-md border p-3">
            <h4 className="text-sm font-medium">{section.title}</h4>
            <div className="mt-2 space-y-1">
              {(section.lessons || []).map((lesson: any, j: number) => (
                <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                  {lesson.completed ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border" />
                  )}
                  <span className="truncate">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
