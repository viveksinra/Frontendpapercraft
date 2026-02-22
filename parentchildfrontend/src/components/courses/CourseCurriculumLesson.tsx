'use client';

import { Video, FileText, Type, HelpCircle, Paperclip, Lock, Clock } from 'lucide-react';

interface CourseCurriculumLessonProps {
  lesson: any;
  isEnrolled: boolean;
  onFreePreview?: (lesson: any) => void;
}

const TYPE_ICONS: Record<string, any> = {
  video: Video,
  pdf: FileText,
  text: Type,
  quiz: HelpCircle,
  resource: Paperclip,
};

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function CourseCurriculumLesson({
  lesson,
  isEnrolled,
  onFreePreview,
}: CourseCurriculumLessonProps) {
  const Icon = TYPE_ICONS[lesson.type] || FileText;
  const isFree = lesson.isFreePreview;
  const isLocked = !isEnrolled && !isFree;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 text-sm ${
        isFree && !isEnrolled ? 'cursor-pointer hover:bg-accent/50' : ''
      }`}
      onClick={() => {
        if (isFree && !isEnrolled && onFreePreview) onFreePreview(lesson);
      }}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{lesson.title}</span>
      <div className="flex items-center gap-2 shrink-0">
        {lesson.durationMinutes > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(lesson.durationMinutes)}
          </span>
        )}
        {isFree && !isEnrolled && (
          <span className="text-xs font-medium text-green-600 px-1.5 py-0.5 rounded bg-green-50">
            FREE
          </span>
        )}
        {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
    </div>
  );
}
