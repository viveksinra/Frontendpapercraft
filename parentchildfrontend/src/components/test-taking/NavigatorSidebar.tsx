'use client';

import { QuestionNavigator } from '@papercraft/shared';
import type { NavigatorQuestion, NavigatorAnswer, NavigatorSection, NavigatorMode } from '@papercraft/shared';

interface NavigatorSidebarProps {
  questions: NavigatorQuestion[];
  answers: NavigatorAnswer[];
  currentIndex: number;
  onSelect: (index: number) => void;
  mode: NavigatorMode;
  sections?: NavigatorSection[];
  currentSectionIndex?: number;
}

export function NavigatorSidebar({
  questions,
  answers,
  currentIndex,
  onSelect,
  mode,
  sections,
  currentSectionIndex,
}: NavigatorSidebarProps) {
  return (
    <aside className="hidden w-64 flex-shrink-0 overflow-y-auto border-l bg-background p-4 lg:block">
      <h3 className="mb-3 text-sm font-semibold">Question Navigator</h3>
      <QuestionNavigator
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        onSelect={onSelect}
        mode={mode}
        sections={sections}
        currentSectionIndex={currentSectionIndex}
      />
    </aside>
  );
}
