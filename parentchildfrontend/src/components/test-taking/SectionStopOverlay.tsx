'use client';

import { SectionTimedController } from '@papercraft/shared';
import type { ControllerSection } from '@papercraft/shared';

interface SectionStopOverlayProps {
  sections: ControllerSection[];
  currentSectionIndex: number;
  onSectionComplete: (completedIndex: number) => void;
  onTimeUp: () => void;
}

export function SectionStopOverlay({
  sections,
  currentSectionIndex,
  onSectionComplete,
  onTimeUp,
}: SectionStopOverlayProps) {
  return (
    <SectionTimedController
      sections={sections}
      currentSectionIndex={currentSectionIndex}
      onSectionComplete={onSectionComplete}
      onTimeUp={onTimeUp}
    />
  );
}
