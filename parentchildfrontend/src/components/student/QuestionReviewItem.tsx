'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';

interface QuestionReviewItemProps {
  questionNumber: number;
  questionText: string;
  answer: unknown;
  correctAnswer?: unknown;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  maxMarks: number;
  explanation?: string;
}

function formatAnswer(answer: unknown): string {
  if (answer == null) return 'Not answered';
  if (typeof answer === 'string') return answer || 'Not answered';
  if (typeof answer === 'boolean') return answer ? 'True' : 'False';
  if (typeof answer === 'number') return String(answer);
  if (Array.isArray(answer)) return answer.length > 0 ? answer.join(', ') : 'Not answered';
  if (typeof answer === 'object') {
    const entries = Object.entries(answer as Record<string, string>);
    return entries.length > 0 ? entries.map(([k, v]) => `${k} -> ${v}`).join('; ') : 'Not answered';
  }
  return String(answer);
}

export function QuestionReviewItem({
  questionNumber,
  questionText,
  answer,
  correctAnswer,
  isCorrect,
  marksAwarded,
  maxMarks,
  explanation,
}: QuestionReviewItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {isCorrect === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {isCorrect === false && <XCircle className="h-5 w-5 text-red-500" />}
            {isCorrect == null && <Minus className="h-5 w-5 text-muted-foreground" />}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Q{questionNumber}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {marksAwarded ?? '-'} / {maxMarks}
              </span>
            </div>

            <p className="text-sm leading-relaxed">{questionText}</p>

            <div className="space-y-1 rounded-md bg-muted/50 p-2.5">
              <p className="text-xs">
                <span className="font-medium text-muted-foreground">Your answer: </span>
                <span className={isCorrect === false ? 'text-red-600 dark:text-red-400' : ''}>
                  {formatAnswer(answer)}
                </span>
              </p>
              {correctAnswer != null && (
                <p className="text-xs">
                  <span className="font-medium text-muted-foreground">Correct: </span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatAnswer(correctAnswer)}
                  </span>
                </p>
              )}
            </div>

            {explanation && (
              <p className="text-xs italic text-muted-foreground">{explanation}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
