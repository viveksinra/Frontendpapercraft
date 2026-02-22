'use client';

import { useState } from 'react';
import { markLessonComplete, markLessonIncomplete } from '@/lib/course-api';
import { Check, Loader2 } from 'lucide-react';

interface LessonCompleteButtonProps {
  courseId: string;
  sectionId: string;
  lessonId: string;
  isCompleted: boolean;
  isLocked?: boolean;
  onToggle: (completed: boolean) => void;
}

export default function LessonCompleteButton({
  courseId,
  sectionId,
  lessonId,
  isCompleted,
  isLocked = false,
  onToggle,
}: LessonCompleteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (isLocked) return;
    setLoading(true);
    try {
      if (isCompleted) {
        await markLessonIncomplete(courseId, { sectionId, lessonId });
        onToggle(false);
      } else {
        await markLessonComplete(courseId, { sectionId, lessonId });
        onToggle(true);
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isLocked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 ${
        isCompleted
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <>
          <Check className="h-4 w-4" /> Completed
        </>
      ) : (
        'Mark as Complete'
      )}
    </button>
  );
}
