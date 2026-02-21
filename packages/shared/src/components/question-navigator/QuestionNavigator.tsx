import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NavigatorQuestion {
  _id: string;
  questionNumber: number;
}

export interface NavigatorAnswer {
  questionId: string;
  answer: unknown;
  flagged: boolean;
}

export interface NavigatorSection {
  name: string;
  questionIds: string[];
}

export type NavigatorMode = "full" | "section_timed";

export interface QuestionNavigatorProps {
  questions: NavigatorQuestion[];
  answers: NavigatorAnswer[];
  currentIndex: number;
  onSelect: (index: number) => void;
  mode: NavigatorMode;
  sections?: NavigatorSection[];
  currentSectionIndex?: number;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type ButtonState = "unanswered" | "answered" | "flagged" | "current" | "locked";

function getButtonState(
  question: NavigatorQuestion,
  answer: NavigatorAnswer | undefined,
  isCurrent: boolean,
  isLocked: boolean
): ButtonState {
  if (isLocked) return "locked";
  if (isCurrent) return "current";
  if (answer?.flagged) return "flagged";
  if (answer?.answer != null && answer.answer !== "" && !(Array.isArray(answer.answer) && answer.answer.length === 0)) {
    return "answered";
  }
  return "unanswered";
}

const STATE_CLASSES: Record<ButtonState, string> = {
  unanswered:
    "border-2 border-border bg-background text-foreground hover:bg-accent hover:border-primary/40",
  answered:
    "border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90",
  flagged:
    "border-2 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900",
  current:
    "border-2 border-primary ring-2 ring-primary/30 bg-primary/10 text-primary font-bold",
  locked:
    "border-2 border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-60",
};

// ─── Component ──────────────────────────────────────────────────────────────

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onSelect,
  mode,
  sections,
  currentSectionIndex = 0,
  className = "",
}: QuestionNavigatorProps) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  // ── Summary counts ────────────────────────────────────────────────────

  let answeredCount = 0;
  let unansweredCount = 0;
  let flaggedCount = 0;

  for (const q of questions) {
    const a = answerMap.get(q._id);
    if (a?.flagged) {
      flaggedCount++;
    } else if (
      a?.answer != null &&
      a.answer !== "" &&
      !(Array.isArray(a.answer) && a.answer.length === 0)
    ) {
      answeredCount++;
    } else {
      unansweredCount++;
    }
  }

  // ── Section-timed grouping ────────────────────────────────────────────

  const isSectionTimed = mode === "section_timed" && sections && sections.length > 0;

  const renderButton = (question: NavigatorQuestion, globalIndex: number, isLocked: boolean) => {
    const answer = answerMap.get(question._id);
    const isCurrent = globalIndex === currentIndex;
    const state = getButtonState(question, answer, isCurrent, isLocked);

    return (
      <button
        key={question._id}
        type="button"
        disabled={state === "locked"}
        onClick={() => onSelect(globalIndex)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all ${STATE_CLASSES[state]}`}
        aria-label={`Question ${question.questionNumber}${state === "flagged" ? " (flagged)" : ""}${state === "answered" ? " (answered)" : ""}${state === "locked" ? " (locked)" : ""}`}
        aria-current={isCurrent ? "true" : undefined}
      >
        {question.questionNumber}
        {state === "flagged" && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-2.5 w-2.5"
            >
              <path d="M3 3.732V13.5a.5.5 0 0 1-1 0V2.5a.5.5 0 0 1 .723-.447l7.064 3.532a.5.5 0 0 1 0 .894L3 10.268V3.732Z" />
            </svg>
          </span>
        )}
      </button>
    );
  };

  // ── Build question index lookup ───────────────────────────────────────

  const questionIndexMap = new Map(questions.map((q, i) => [q._id, i]));

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {isSectionTimed ? (
        // Grouped by section with headers
        sections!.map((section, sectionIdx) => {
          const isLocked = sectionIdx < currentSectionIndex;
          const isFuture = sectionIdx > currentSectionIndex;

          return (
            <div key={section.name + sectionIdx}>
              <h4
                className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                  sectionIdx === currentSectionIndex
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {section.name}
                {sectionIdx === currentSectionIndex && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
                )}
              </h4>
              <div className="grid grid-cols-5 gap-1.5">
                {section.questionIds.map((qId) => {
                  const globalIdx = questionIndexMap.get(qId);
                  const question = globalIdx != null ? questions[globalIdx] : null;
                  if (!question || globalIdx == null) return null;
                  return renderButton(question, globalIdx, isLocked || isFuture);
                })}
              </div>
            </div>
          );
        })
      ) : (
        // Flat grid
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((q, i) => renderButton(q, i, false))}
        </div>
      )}

      {/* Summary counts */}
      <div className="flex flex-wrap items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border-2 border-primary bg-primary" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border-2 border-border bg-background" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border-2 border-amber-500 bg-amber-50 dark:bg-amber-950" />
          <span>Flagged ({flaggedCount})</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionNavigator;
