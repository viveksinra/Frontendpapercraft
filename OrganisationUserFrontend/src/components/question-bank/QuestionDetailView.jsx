'use client';

import { Card, CardContent } from '@/components/ui/card';

import QuestionPreview from './QuestionPreview';
import QuestionTypeBadge from './QuestionTypeBadge';
import SubjectBreadcrumb from './SubjectBreadcrumb';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

export default function QuestionDetailView({ question }) {
  if (!question) return null;

  const meta = question.metadata || {};

  return (
    <div className="space-y-4">
      {/* Question Preview */}
      <QuestionPreview type={question.type} content={question.content} metadata={meta} />

      {/* Metadata Card */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h3 className="text-sm font-semibold">Metadata</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>{' '}
              <QuestionTypeBadge type={question.type} />
            </div>
            <div>
              <span className="text-muted-foreground">Difficulty:</span>{' '}
              <QuestionDifficultyBadge difficulty={meta.difficulty} />
            </div>
            <div>
              <span className="text-muted-foreground">Marks:</span> {meta.marks ?? 1}
            </div>
            <div>
              <span className="text-muted-foreground">Negative Marks:</span> {meta.negativeMarks ?? 0}
            </div>
            <div>
              <span className="text-muted-foreground">Expected Time:</span> {meta.expectedTime ?? 60}s
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span> {meta.language || 'en'}
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Subject:</span>{' '}
              <SubjectBreadcrumb question={question} />
            </div>
            {meta.tags && meta.tags.length > 0 && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Tags:</span>{' '}
                {meta.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs mr-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {meta.examTypes && meta.examTypes.length > 0 && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Exam Types:</span>{' '}
                {meta.examTypes.join(', ')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Card */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h3 className="text-sm font-semibold">Usage</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-lg font-bold">{question.usage?.paperCount || 0}</p>
              <p className="text-xs text-muted-foreground">Papers</p>
            </div>
            <div>
              <p className="text-lg font-bold">{question.usage?.testCount || 0}</p>
              <p className="text-xs text-muted-foreground">Tests</p>
            </div>
            <div>
              <p className="text-lg font-bold">{question.usage?.homeworkCount || 0}</p>
              <p className="text-xs text-muted-foreground">Homework</p>
            </div>
          </div>
          {question.usage?.lastUsedAt && (
            <p className="text-xs text-muted-foreground">
              Last used: {new Date(question.usage.lastUsedAt).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Performance Card */}
      {question.performance?.totalAttempts > 0 && (
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-semibold">Performance</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-lg font-bold">{question.performance.totalAttempts}</p>
                <p className="text-xs text-muted-foreground">Attempts</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {question.performance.totalAttempts > 0
                    ? Math.round((question.performance.correctAttempts / question.performance.totalAttempts) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <p className="text-lg font-bold">{Math.round(question.performance.avgTimeSpent)}s</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
