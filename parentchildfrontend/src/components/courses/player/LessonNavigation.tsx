'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  prevTitle?: string;
  nextTitle?: string;
}

export default function LessonNavigation({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  prevTitle,
  nextTitle,
}: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-md border disabled:opacity-50 hover:bg-accent transition-colors min-h-[44px]"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline truncate max-w-[150px]">
          {prevTitle || 'Previous'}
        </span>
        <span className="sm:hidden">Prev</span>
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-md border disabled:opacity-50 hover:bg-accent transition-colors min-h-[44px]"
      >
        <span className="hidden sm:inline truncate max-w-[150px]">
          {nextTitle || 'Next'}
        </span>
        <span className="sm:hidden">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
