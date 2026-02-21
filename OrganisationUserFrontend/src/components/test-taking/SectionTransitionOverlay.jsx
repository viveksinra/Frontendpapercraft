'use client';

import { SectionTimedController } from '@papercraft/shared';

export default function SectionTransitionOverlay({
  sections,
  currentSectionIndex,
  onContinue,
  onTimeUp,
}) {
  // Map test sections to the shape expected by SectionTimedController
  const controllerSections = sections.map((s) => ({
    name: s.name,
    timeLimit: s.timeLimit,
    questionIds: s.questionIds || [],
    instructions: s.instructions || '',
  }));

  const handleSectionComplete = (completedIndex) => {
    onContinue(completedIndex);
  };

  return (
    <SectionTimedController
      sections={controllerSections}
      currentSectionIndex={currentSectionIndex}
      onSectionComplete={handleSectionComplete}
      onTimeUp={onTimeUp}
    />
  );
}
