import React from "react";
import { TimerComponent } from "../timer/TimerComponent";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ControllerSection {
  name: string;
  timeLimit: number; // in minutes
  questionIds: string[];
  instructions?: string;
}

export interface SectionTimedControllerProps {
  sections: ControllerSection[];
  currentSectionIndex: number;
  onSectionComplete: (completedIndex: number) => void;
  onTimeUp: () => void;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SectionTimedController({
  sections,
  currentSectionIndex,
  onSectionComplete,
  onTimeUp,
  className = "",
}: SectionTimedControllerProps) {
  const [expired, setExpired] = React.useState(false);

  const isLastSection = currentSectionIndex >= sections.length - 1;
  const currentSection = sections[currentSectionIndex];

  // Reset expired state when section changes
  React.useEffect(() => {
    setExpired(false);
  }, [currentSectionIndex]);

  const handleExpiry = React.useCallback(() => {
    setExpired(true);
    if (isLastSection) {
      onTimeUp();
    }
  }, [isLastSection, onTimeUp]);

  const handleContinue = React.useCallback(() => {
    setExpired(false);
    onSectionComplete(currentSectionIndex);
  }, [currentSectionIndex, onSectionComplete]);

  if (!currentSection) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Active section timer - rendered as part of normal flow */}
      {!expired && (
        <TimerComponent
          totalSeconds={currentSection.timeLimit * 60}
          onExpiry={handleExpiry}
          mode="countdown"
        />
      )}

      {/* STOP overlay when time expires and it is NOT the last section */}
      {expired && !isLastSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl bg-background p-8 text-center shadow-2xl">
            {/* Stop icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-red-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-red-600">STOP</h2>

            <p className="text-muted-foreground">
              Time for <span className="font-semibold text-foreground">{currentSection.name}</span>{" "}
              has expired. You can no longer change answers in this section.
            </p>

            {currentSectionIndex + 1 < sections.length && (
              <p className="text-sm text-muted-foreground">
                Next section:{" "}
                <span className="font-medium text-foreground">
                  {sections[currentSectionIndex + 1].name}
                </span>{" "}
                ({sections[currentSectionIndex + 1].timeLimit} min)
              </p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Continue to next section
            </button>
          </div>
        </div>
      )}

      {/* Last section auto-submitted overlay */}
      {expired && isLastSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl bg-background p-8 text-center shadow-2xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Test Submitted</h2>

            <p className="text-muted-foreground">
              Time for the final section has expired. Your test has been automatically submitted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionTimedController;
