'use client';

import { Card, CardContent } from '@/components/ui/card';
import QuestionTypeBadge from './QuestionTypeBadge';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

export default function QuestionPreview({ type, content, metadata }) {
  if (!content?.body) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Start typing to see a live preview of your question
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-4 space-y-4">
        <div className="flex items-center gap-2">
          <QuestionTypeBadge type={type} />
          <QuestionDifficultyBadge difficulty={metadata?.difficulty} />
          {metadata?.marks != null && (
            <span className="text-xs text-muted-foreground ml-auto">[{metadata.marks} marks]</span>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          {content.passage && (
            <div className="bg-muted/50 p-3 rounded-md mb-3 text-sm italic border-l-4 border-primary/30">
              {content.passage}
            </div>
          )}

          {content.assertion && (
            <div className="mb-2">
              <strong>Assertion:</strong> {content.assertion}
            </div>
          )}
          {content.reason && (
            <div className="mb-2">
              <strong>Reason:</strong> {content.reason}
            </div>
          )}

          <p>{content.body}</p>
        </div>

        {/* Options */}
        {content.options && content.options.length > 0 && (
          <div className="space-y-1.5">
            {content.options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2 rounded text-sm ${opt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-muted/30'}`}
              >
                <span className="font-medium shrink-0">{opt.label || String.fromCharCode(65 + i)}.</span>
                <span>{opt.text}</span>
                {opt.isCorrect && <span className="ml-auto text-green-600 text-xs font-medium">Correct</span>}
              </div>
            ))}
          </div>
        )}

        {/* Match Pairs */}
        {content.matchPairs && content.matchPairs.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-2 gap-0 text-xs font-medium bg-muted px-3 py-1.5">
              <span>Column A</span>
              <span>Column B</span>
            </div>
            {content.matchPairs.map((pair, i) => (
              <div key={i} className="grid grid-cols-2 gap-0 text-sm px-3 py-1.5 border-t">
                <span>{pair.left}</span>
                <span>{pair.right}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sub-Questions */}
        {content.subQuestions && content.subQuestions.length > 0 && (
          <div className="space-y-3 mt-3">
            {content.subQuestions.map((sq, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-3">
                <p className="text-sm font-medium">Q{sq.questionNumber}. {sq.body}</p>
                {sq.options && sq.options.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {sq.options.map((opt, j) => (
                      <div key={j} className={`text-xs ${opt.isCorrect ? 'text-green-700 font-medium' : ''}`}>
                        {opt.label || String.fromCharCode(65 + j)}. {opt.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Numerical Answer */}
        {content.numericalAnswer !== undefined && (
          <div className="text-sm">
            <strong>Answer:</strong> {content.numericalAnswer}
            {content.numericalUnit && ` ${content.numericalUnit}`}
            {content.numericalTolerance > 0 && ` (±${content.numericalTolerance})`}
          </div>
        )}

        {/* Correct Answer */}
        {content.correctAnswer && type !== 'numerical' && (
          <div className="text-sm bg-green-50 border border-green-200 rounded p-2">
            <strong>Answer:</strong> {content.correctAnswer}
          </div>
        )}

        {/* Explanation */}
        {content.explanation && (
          <div className="text-sm bg-blue-50 border border-blue-200 rounded p-2">
            <strong>Explanation:</strong> {content.explanation}
          </div>
        )}

        {/* Solution */}
        {content.solution && (
          <div className="text-sm bg-purple-50 border border-purple-200 rounded p-2">
            <strong>Solution:</strong> {content.solution}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
