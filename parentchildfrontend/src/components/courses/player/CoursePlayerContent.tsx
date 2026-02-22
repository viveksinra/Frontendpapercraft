'use client';

import VideoLesson from './VideoLesson';
import PdfLesson from './PdfLesson';
import TextLesson from './TextLesson';
import QuizLesson from './QuizLesson';
import ResourceLesson from './ResourceLesson';

interface CoursePlayerContentProps {
  lesson: any;
  content: any;
  courseId: string;
  sectionId: string;
  onQuizComplete?: (score: number) => void;
}

export default function CoursePlayerContent({
  lesson,
  content,
  courseId,
  sectionId,
  onQuizComplete,
}: CoursePlayerContentProps) {
  if (!content && !lesson) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a lesson to begin
      </div>
    );
  }

  const lessonContent = content || lesson.content || {};

  switch (lesson.type) {
    case 'video':
      return (
        <VideoLesson
          videoUrl={lessonContent.videoUrl}
          thumbnailUrl={lessonContent.thumbnailUrl}
        />
      );
    case 'pdf':
      return (
        <PdfLesson
          pdfUrl={lessonContent.pdfUrl}
          fileName={lessonContent.fileName}
        />
      );
    case 'text':
      return <TextLesson htmlContent={lessonContent.htmlContent} />;
    case 'quiz':
      return (
        <QuizLesson
          testId={lessonContent.testId}
          onComplete={onQuizComplete}
        />
      );
    case 'resource':
      return <ResourceLesson resources={lessonContent.resources || []} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Unsupported lesson type: {lesson.type}
        </div>
      );
  }
}
