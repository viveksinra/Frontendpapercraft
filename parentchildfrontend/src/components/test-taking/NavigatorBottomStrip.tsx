'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { QuestionNavigator } from '@papercraft/shared';
import { Grid3X3 } from 'lucide-react';
import type { NavigatorQuestion, NavigatorAnswer, NavigatorSection, NavigatorMode } from '@papercraft/shared';

interface NavigatorBottomStripProps {
  questions: NavigatorQuestion[];
  answers: NavigatorAnswer[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  mode: NavigatorMode;
  sections?: NavigatorSection[];
  currentSectionIndex?: number;
  total: number;
}

export function NavigatorBottomStrip({
  questions,
  answers,
  currentIndex,
  onSelect,
  onPrev,
  onNext,
  mode,
  sections,
  currentSectionIndex,
  total,
}: NavigatorBottomStripProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (index: number) => {
    onSelect(index);
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background p-2 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          className="min-h-[44px] min-w-[44px]"
        >
          Prev
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 min-h-[44px]">
              <Grid3X3 className="h-3.5 w-3.5" />
              {currentIndex + 1} / {total}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[60vh]">
            <SheetHeader>
              <SheetTitle>Question Navigator</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto pb-4">
              <QuestionNavigator
                questions={questions}
                answers={answers}
                currentIndex={currentIndex}
                onSelect={handleSelect}
                mode={mode}
                sections={sections}
                currentSectionIndex={currentSectionIndex}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentIndex >= total - 1}
          className="min-h-[44px] min-w-[44px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
