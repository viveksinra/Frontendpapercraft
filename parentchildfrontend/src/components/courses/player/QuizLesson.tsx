'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface QuizLessonProps {
  testId: string;
  onComplete?: (score: number) => void;
}

export default function QuizLesson({ testId, onComplete }: QuizLessonProps) {
  const [started, setStarted] = useState(false);

  if (!testId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Quiz not available.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-sm text-muted-foreground">
          This lesson contains a quiz. Click below to begin.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <iframe
        src={`/student/take-test/${testId}?embedded=true`}
        className="w-full h-[600px]"
        title="Quiz"
        onLoad={(e) => {
          // Listen for quiz completion messages from the iframe
          function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'quiz-complete' && event.data?.score !== undefined) {
              onComplete?.(event.data.score);
            }
          }
          window.addEventListener('message', handleMessage);
          return () => window.removeEventListener('message', handleMessage);
        }}
      />
    </div>
  );
}
