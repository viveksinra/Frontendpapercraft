'use client';

import { CheckCircle, XCircle, Clock, Flag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function QuestionReviewList({ answers = [], showSolutions = false }) {
  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions to review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Question-by-Question Review</h3>

      {answers.map((answer, idx) => {
        const isCorrect = answer.isCorrect ?? (answer.marksAwarded === answer.maxMarks);
        const isPartial = !isCorrect && answer.marksAwarded > 0;

        return (
          <div
            key={answer.questionId ?? idx}
            className={`rounded-lg border p-4 transition-colors ${
              isCorrect
                ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
                : isPartial
                  ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20'
                  : 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
            }`}
          >
            {/* Question Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    Q{answer.questionNumber ?? idx + 1}.{' '}
                    {answer.questionText || 'Question text not available'}
                  </p>
                  {answer.flagged && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(answer.timeTaken)}
                </span>
                <Badge variant={isCorrect ? 'default' : isPartial ? 'secondary' : 'destructive'}>
                  {answer.marksAwarded ?? 0}/{answer.maxMarks ?? 0}
                </Badge>
              </div>
            </div>

            {/* Student Answer */}
            <div className="ml-7 space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Your Answer</p>
                <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {answer.studentAnswer ?? answer.selectedOption ?? 'Not answered'}
                </p>
              </div>

              {/* Correct Answer (if solutions enabled) */}
              {showSolutions && answer.correctAnswer != null && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer</p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {answer.correctAnswer}
                  </p>
                </div>
              )}

              {/* Explanation (if solutions enabled) */}
              {showSolutions && answer.explanation && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Explanation</p>
                  <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
