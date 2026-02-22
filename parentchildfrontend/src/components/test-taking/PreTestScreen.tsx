'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, FileText, ShieldCheck, Play } from 'lucide-react';

interface PreTestScreenProps {
  testTitle: string;
  totalQuestions: number;
  durationMinutes: number;
  mode: string;
  sections?: { name: string; timeLimit: number }[];
  onBegin: () => void;
}

export function PreTestScreen({
  testTitle,
  totalQuestions,
  durationMinutes,
  mode,
  sections,
  onBegin,
}: PreTestScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl">{testTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">{totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">{durationMinutes} min</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </div>

          {sections && sections.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Sections</h4>
              {sections.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                  <span>{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.timeLimit} min</span>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Rules</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>- Do not refresh or close the browser during the test.</li>
              <li>- Your answers are auto-saved periodically.</li>
              <li>- The timer starts as soon as you begin.</li>
              {mode === 'section_timed' && (
                <li>- Each section has its own timer. You cannot return to completed sections.</li>
              )}
              {mode === 'practice' && (
                <li>- This is a practice test. You will receive instant feedback.</li>
              )}
            </ul>
          </div>

          <Button size="lg" className="w-full" onClick={onBegin}>
            <Play className="mr-2 h-4 w-4" />
            Begin Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
