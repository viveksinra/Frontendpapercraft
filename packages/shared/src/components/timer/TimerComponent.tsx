import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatTimeRemaining } from "../../utils/time";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TimerMode = "countdown" | "countup" | "display_only";

export interface TimerComponentProps {
  /** Total seconds for the timer (countdown limit or display value). */
  totalSeconds: number;
  /** Called when countdown reaches zero. Ignored for countup / display_only. */
  onExpiry?: () => void;
  /** Timer behaviour mode. */
  mode: TimerMode;
  /** When true the timer freezes at its current value. */
  paused?: boolean;
  /** Additional CSS class names applied to the root element. */
  className?: string;
}

// ─── Visual-state thresholds ────────────────────────────────────────────────

const WARNING_THRESHOLD = 5 * 60; // 5 minutes
const CRITICAL_THRESHOLD = 60; // 1 minute

type VisualState = "normal" | "warning" | "critical" | "expired";

function getVisualState(remaining: number, mode: TimerMode): VisualState {
  if (mode !== "countdown") return "normal";
  if (remaining <= 0) return "expired";
  if (remaining < CRITICAL_THRESHOLD) return "critical";
  if (remaining < WARNING_THRESHOLD) return "warning";
  return "normal";
}

// ─── Style maps ─────────────────────────────────────────────────────────────

const STATE_CLASSES: Record<VisualState, string> = {
  normal: "text-foreground",
  warning: "text-amber-500 animate-pulse",
  critical: "text-red-500 animate-[pulse_0.5s_ease-in-out_infinite]",
  expired: "text-red-600 font-bold",
};

// ─── Component ──────────────────────────────────────────────────────────────

export function TimerComponent({
  totalSeconds,
  onExpiry,
  mode,
  paused = false,
  className = "",
}: TimerComponentProps) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const expiredRef = useRef(false);

  // Reset when totalSeconds or mode change
  useEffect(() => {
    setElapsed(0);
    expiredRef.current = false;
    lastTickRef.current = null;
  }, [totalSeconds, mode]);

  // requestAnimationFrame loop
  const tick = useCallback(
    (now: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = now;
      }

      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setElapsed((prev) => {
        const next = prev + delta;

        // For countdown, check expiry
        if (mode === "countdown" && next >= totalSeconds && !expiredRef.current) {
          expiredRef.current = true;
          // Fire onExpiry on next microtask to avoid setState-in-render issues
          queueMicrotask(() => onExpiry?.());
          return totalSeconds;
        }

        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    },
    [mode, totalSeconds, onExpiry]
  );

  useEffect(() => {
    if (mode === "display_only" || paused) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
      return;
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
    };
  }, [mode, paused, tick]);

  // ── Derived display values ──────────────────────────────────────────────

  const displaySeconds =
    mode === "countdown"
      ? Math.max(0, totalSeconds - elapsed)
      : mode === "countup"
        ? elapsed
        : totalSeconds;

  const visualState = getVisualState(displaySeconds, mode);
  const formattedTime = formatTimeRemaining(Math.floor(displaySeconds));

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-lg tabular-nums ${STATE_CLASSES[visualState]} ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={
        visualState === "expired" ? "Time is up" : `Time remaining: ${formattedTime}`
      }
    >
      {visualState === "expired" ? (
        <span className="text-red-600 font-bold tracking-wide">Time&apos;s Up</span>
      ) : (
        <span>{formattedTime}</span>
      )}
    </div>
  );
}

export default TimerComponent;
