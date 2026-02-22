'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

interface ContinueLearningButtonProps {
  courseSlug: string;
}

export default function ContinueLearningButton({ courseSlug }: ContinueLearningButtonProps) {
  return (
    <Link
      href={`/student/courses/${courseSlug}/learn`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
    >
      <Play className="h-3 w-3" /> Continue
    </Link>
  );
}
