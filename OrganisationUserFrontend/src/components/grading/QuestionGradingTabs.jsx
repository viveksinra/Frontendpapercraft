'use client';

import { Circle, CheckCircle, AlertCircle } from 'lucide-react';

function statusIcon(question) {
  if (question.gradedCount != null && question.totalResponses != null) {
    if (question.gradedCount >= question.totalResponses) {
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    }
    if (question.gradedCount > 0) {
      return <AlertCircle className="h-3 w-3 text-orange-500" />;
    }
  }
  return <Circle className="h-3 w-3 text-muted-foreground" />;
}

function typeLabel(type) {
  switch (type) {
    case 'short_answer':
      return 'Short';
    case 'long_answer':
      return 'Long';
    case 'essay':
      return 'Essay';
    default:
      return type || 'Subjective';
  }
}

export default function QuestionGradingTabs({ questions = [], activeQuestion, onSelect }) {
  if (questions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        No subjective questions to grade.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q, idx) => {
        const isActive = activeQuestion === idx || activeQuestion === q.questionId;

        return (
          <button
            key={q.questionId ?? idx}
            type="button"
            onClick={() => onSelect?.(idx)}
            className={`
              flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
              ${isActive
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border bg-background hover:bg-muted text-foreground'
              }
            `}
          >
            {statusIcon(q)}
            <span>Q{q.questionNumber ?? idx + 1}</span>
            <span className="text-xs text-muted-foreground">({typeLabel(q.type)})</span>
          </button>
        );
      })}
    </div>
  );
}
