'use client';

import { QuestionReviewItem } from './QuestionReviewItem';

interface ReviewQuestion {
  questionId: string;
  questionNumber: number;
  questionText: string;
  answer: unknown;
  correctAnswer?: unknown;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  maxMarks: number;
  explanation?: string;
}

interface QuestionReviewListProps {
  questions: ReviewQuestion[];
}

export function QuestionReviewList({ questions }: QuestionReviewListProps) {
  if (questions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">No questions to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Question Review</h3>
      <div className="space-y-2">
        {questions.map((q) => (
          <QuestionReviewItem
            key={q.questionId}
            questionNumber={q.questionNumber}
            questionText={q.questionText}
            answer={q.answer}
            correctAnswer={q.correctAnswer}
            isCorrect={q.isCorrect}
            marksAwarded={q.marksAwarded}
            maxMarks={q.maxMarks}
            explanation={q.explanation}
          />
        ))}
      </div>
    </div>
  );
}
