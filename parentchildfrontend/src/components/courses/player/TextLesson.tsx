'use client';

interface TextLessonProps {
  htmlContent: string;
}

export default function TextLesson({ htmlContent }: TextLessonProps) {
  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">No content available.</p>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
