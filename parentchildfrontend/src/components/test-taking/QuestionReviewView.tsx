'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';

interface ReviewQuestion {
  questionId: string;
  questionNumber: number;
  questionText: string;
  type: string;
  answer: unknown;
  correctAnswer?: unknown;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  maxMarks: number;
  explanation?: string;
}

interface QuestionReviewViewProps {
  questions: ReviewQuestion[];
}

function formatAnswer(answer: unknown): string {
  if (answer == null) return 'Not answered';
  if (typeof answer === 'string') return answer;
  if (typeof answer === 'boolean') return answer ? 'True' : 'False';
  if (typeof answer === 'number') return String(answer);
  if (Array.isArray(answer)) return answer.join(', ');
  if (typeof answer === 'object') {
    return Object.entries(answer as Record<string, string>)
      .map(([k, v]) => `${k} -> ${v}`)
      .join(', ');
  }
  return String(answer);
}

function StatusIcon({ isCorrect }: { isCorrect: boolean | null }) {
  if (isCorrect === true) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (isCorrect === false) return <XCircle className="h-5 w-5 text-red-500" />;
  return <Minus className="h-5 w-5 text-muted-foreground" />;
}

export function QuestionReviewView({ questions }: QuestionReviewViewProps) {
  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <Card key={q.questionId}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <StatusIcon isCorrect={q.isCorrect} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Q{q.questionNumber}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {q.marksAwarded ?? '-'} / {q.maxMarks}
                  </span>
                </div>
                <p className="mt-1 text-sm">{q.questionText}</p>

                <div className="mt-2 space-y-1">
                  <p className="text-xs">
                    <span className="font-medium text-muted-foreground">Your answer: </span>
                    <span className={q.isCorrect === false ? 'text-red-600 dark:text-red-400' : ''}>
                      {formatAnswer(q.answer)}
                    </span>
                  </p>
                  {q.correctAnswer != null && (
                    <p className="text-xs">
                      <span className="font-medium text-muted-foreground">Correct answer: </span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatAnswer(q.correctAnswer)}
                      </span>
                    </p>
                  )}
                </div>

                {q.explanation && (
                  <div className="mt-2 rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
