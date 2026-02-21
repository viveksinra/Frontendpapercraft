'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaperReviewPanel({ title, templateName, sections = [] }) {
  const totalQuestions = sections.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
  const totalMarks = sections.reduce(
    (sum, s) => sum + (s.questions || []).reduce((qs, q) => qs + (q.marks || 0), 0),
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{title || 'Untitled Paper'}</h3>
            {templateName && (
              <p className="text-sm text-muted-foreground">Template: {templateName}</p>
            )}
            <div className="flex gap-3 text-sm">
              <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
              <span>{totalQuestions} question{totalQuestions !== 1 ? 's' : ''}</span>
              <span className="font-medium">{totalMarks} total marks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{section.name || `Section ${i + 1}`}</span>
              <Badge variant="outline">
                {(section.questions || []).reduce((s, q) => s + (q.marks || 0), 0)} marks
              </Badge>
            </CardTitle>
            {section.instructions && (
              <p className="text-xs text-muted-foreground italic">{section.instructions}</p>
            )}
          </CardHeader>
          <CardContent>
            {(section.questions || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions</p>
            ) : (
              <div className="space-y-1.5">
                {(section.questions || []).map((q, qi) => (
                  <div key={q._id || q.id || qi} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground font-medium w-6 shrink-0">{qi + 1}.</span>
                    <span className="flex-1 truncate">{q.content?.text || q.title || 'Question'}</span>
                    <span className="text-muted-foreground shrink-0">[{q.marks || 0}m]</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
