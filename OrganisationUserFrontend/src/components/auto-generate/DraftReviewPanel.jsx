'use client';

import { ArrowLeftRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import FeasibilityWarning from './FeasibilityWarning';

export default function DraftReviewPanel({ paper, onSwapClick }) {
  if (!paper) return null;

  const sections = paper.sections || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{paper.title || 'Auto-Generated Paper'}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sections.length} section{sections.length !== 1 ? 's' : ''} &middot;{' '}
            {sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0)} questions &middot;{' '}
            {sections.reduce(
              (s, sec) => s + (sec.questions || []).reduce((qs, q) => qs + (q.marks || 0), 0),
              0
            )}{' '}
            marks
          </p>
        </CardContent>
      </Card>

      {paper.warnings && paper.warnings.length > 0 && (
        <div className="space-y-2">
          {paper.warnings.map((w, i) => (
            <FeasibilityWarning key={i} message={w} />
          ))}
        </div>
      )}

      {sections.map((section, si) => (
        <Card key={si}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{section.name || `Section ${si + 1}`}</span>
              <Badge variant="outline">
                {(section.questions || []).reduce((s, q) => s + (q.marks || 0), 0)} marks
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(section.questions || []).map((q, qi) => (
                <div key={q.questionId || q._id || qi} className="flex items-center gap-2 p-2 border rounded-md">
                  <span className="text-xs font-bold text-muted-foreground w-6">{qi + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{q.content?.text || q.title || 'Question'}</p>
                    <div className="flex gap-1.5 mt-0.5">
                      {q.type && <Badge variant="outline" className="text-[10px]">{q.type}</Badge>}
                      {q.difficulty && <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">[{q.marks || 0}m]</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => onSwapClick?.(si, qi, q)}
                    title="Swap question"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
