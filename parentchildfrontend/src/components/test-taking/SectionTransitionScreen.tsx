'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, FileText } from 'lucide-react';

interface SectionTransitionScreenProps {
  sectionName: string;
  sectionNumber: number;
  totalSections: number;
  timeLimit: number;
  questionCount: number;
  instructions?: string;
  onContinue: () => void;
}

export function SectionTransitionScreen({
  sectionName,
  sectionNumber,
  totalSections,
  timeLimit,
  questionCount,
  instructions,
  onContinue,
}: SectionTransitionScreenProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-5 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {sectionNumber}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Section {sectionNumber} of {totalSections}
            </p>
            <h2 className="mt-1 text-xl font-bold">{sectionName}</h2>
          </div>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {questionCount} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {timeLimit} min
            </span>
          </div>

          {instructions && (
            <p className="rounded-lg bg-muted/50 p-3 text-left text-xs text-muted-foreground">
              {instructions}
            </p>
          )}

          <Button size="lg" className="w-full" onClick={onContinue}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
