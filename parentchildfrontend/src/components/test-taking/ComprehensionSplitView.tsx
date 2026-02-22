'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, HelpCircle } from 'lucide-react';

interface ComprehensionSplitViewProps {
  passage: string;
  children: React.ReactNode;
}

export function ComprehensionSplitView({ passage, children }: ComprehensionSplitViewProps) {
  const [mobileView, setMobileView] = useState<'passage' | 'question'>('question');

  return (
    <div className="flex h-full flex-col">
      {/* Mobile toggle */}
      <div className="flex gap-1 border-b p-2 md:hidden">
        <Button
          variant={mobileView === 'passage' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setMobileView('passage')}
        >
          <BookOpen className="mr-1 h-3.5 w-3.5" />
          Passage
        </Button>
        <Button
          variant={mobileView === 'question' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setMobileView('question')}
        >
          <HelpCircle className="mr-1 h-3.5 w-3.5" />
          Question
        </Button>
      </div>

      {/* Desktop split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Passage panel */}
        <div
          className={`w-full overflow-y-auto border-r p-4 md:block md:w-1/2 ${
            mobileView === 'passage' ? 'block' : 'hidden'
          }`}
        >
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Reading Passage</h4>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {passage.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Question panel */}
        <div
          className={`w-full overflow-y-auto p-4 md:block md:w-1/2 ${
            mobileView === 'question' ? 'block' : 'hidden'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
