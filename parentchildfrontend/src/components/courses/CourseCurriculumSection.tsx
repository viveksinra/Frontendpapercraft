'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import CourseCurriculumLesson from './CourseCurriculumLesson';

interface CourseCurriculumSectionProps {
  section: any;
  isEnrolled: boolean;
  defaultOpen?: boolean;
  onFreePreview?: (lesson: any) => void;
}

export default function CourseCurriculumSection({
  section,
  isEnrolled,
  defaultOpen = false,
  onFreePreview,
}: CourseCurriculumSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const lessons = section.lessons || [];

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        className="flex items-center gap-2 w-full px-4 py-3 text-left bg-muted/50 hover:bg-muted transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        <span className="font-medium text-sm flex-1">{section.title}</span>
        <span className="text-xs text-muted-foreground">
          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
        </span>
      </button>
      {open && lessons.length > 0 && (
        <div className="divide-y">
          {lessons.map((lesson: any, i: number) => (
            <CourseCurriculumLesson
              key={lesson._id || i}
              lesson={lesson}
              isEnrolled={isEnrolled}
              onFreePreview={onFreePreview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
