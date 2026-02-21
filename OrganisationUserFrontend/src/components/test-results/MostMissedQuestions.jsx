'use client';

import { AlertTriangle } from 'lucide-react';

export default function MostMissedQuestions({ questions = [] }) {
  const topFive = questions.slice(0, 5);

  if (topFive.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Most Missed Questions</h3>
        <p className="text-sm text-muted-foreground">No data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        Most Missed Questions
      </h3>

      <div className="space-y-2">
        {topFive.map((q, idx) => {
          const incorrectPct = q.incorrectPercentage ?? 0;

          return (
            <div key={q.questionId ?? idx} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-5 text-right">
                {idx + 1}.
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{q.questionText || `Question ${q.questionNumber ?? idx + 1}`}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${incorrectPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-red-600 w-12 text-right">
                    {incorrectPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
