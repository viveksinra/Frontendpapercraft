'use client';

import { Clock, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MODE_LABELS = {
  live_mock: 'Live Mock',
  anytime_mock: 'Anytime Mock',
  practice: 'Practice',
  classroom: 'Classroom',
  section_timed: 'Section Timed',
};

function formatDuration(minutes) {
  if (!minutes) return '--';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function TestPreStartScreen({ test, onStart, loading = false }) {
  if (!test) return null;

  const modeLabel = MODE_LABELS[test.mode] || test.mode;
  const duration = test.scheduling?.duration;
  const totalQuestions = test.totalQuestions;

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{test.title}</CardTitle>
          {test.description && (
            <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Meta info row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary">{modeLabel}</Badge>

            {totalQuestions != null && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4" />
                <span>
                  {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {duration != null && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}

            {test.totalMarks != null && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{test.totalMarks} marks</span>
              </div>
            )}
          </div>

          {/* Sections preview for section-timed */}
          {test.mode === 'section_timed' && test.sections?.length > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">Sections</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {test.sections.map((section, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{section.name}</span>
                    <span className="tabular-nums">
                      {section.questionIds?.length ?? 0} Qs &middot;{' '}
                      {section.timeLimit} min
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {test.sections?.[0]?.instructions && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="mb-2 text-sm font-semibold">Instructions</h4>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {test.sections[0].instructions}
              </p>
            </div>
          )}

          {/* Start button */}
          <Button
            size="lg"
            className="w-full text-base"
            onClick={onStart}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              'Start Test'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
