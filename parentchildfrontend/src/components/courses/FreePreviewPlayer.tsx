'use client';

import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FreePreviewPlayerProps {
  lesson: any;
  courseSlug: string;
  onClose: () => void;
}

export default function FreePreviewPlayer({ lesson, courseSlug, onClose }: FreePreviewPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to course
        </button>
        <span className="text-xs font-medium text-green-600 px-2 py-0.5 rounded bg-green-50">
          FREE PREVIEW
        </span>
      </div>

      <h2 className="text-lg font-semibold">{lesson.title}</h2>

      <div className="rounded-lg border bg-card overflow-hidden">
        {lesson.type === 'video' && lesson.content?.videoUrl && (
          <video
            src={lesson.content.videoUrl}
            controls
            className="w-full aspect-video"
            poster={lesson.content.thumbnailUrl}
          />
        )}
        {lesson.type === 'pdf' && lesson.content?.pdfUrl && (
          <iframe
            src={lesson.content.pdfUrl}
            className="w-full h-[600px]"
            title={lesson.title}
          />
        )}
        {lesson.type === 'text' && lesson.content?.htmlContent && (
          <div
            className="prose prose-sm max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: lesson.content.htmlContent }}
          />
        )}
        {lesson.type === 'resource' && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              Resource files are available after enrollment.
            </p>
          </div>
        )}
        {lesson.type === 'quiz' && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              Quizzes are available after enrollment.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm font-medium">Want access to all lessons?</p>
        <Link
          href={`/student/courses/${courseSlug}`}
          className="inline-block mt-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Enroll to access all lessons
        </Link>
      </div>
    </div>
  );
}
