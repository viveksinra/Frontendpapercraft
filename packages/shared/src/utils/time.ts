/**
 * Phase 3 -- Shared timer utility functions
 * Used by both the backend (time validation) and frontend (timer display).
 */

/**
 * Format remaining seconds into a human-readable timer string.
 * Returns "MM:SS" for under one hour, "H:MM:SS" for one hour or more.
 * Clamps negative values to 0.
 */
export function formatTimeRemaining(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Calculate the number of seconds remaining for a section given its start time
 * and time limit in minutes.
 * Returns 0 if time has already expired.
 */
export function calculateSectionTimeRemaining(
  startedAt: Date | string,
  timeLimitMinutes: number
): number {
  const start =
    typeof startedAt === "string" ? new Date(startedAt) : startedAt;
  const now = new Date();
  const elapsedMs = now.getTime() - start.getTime();
  const totalMs = timeLimitMinutes * 60 * 1000;
  const remainingMs = totalMs - elapsedMs;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Returns true if the remaining time is in a warning state:
 * less than 5 minutes remaining OR less than 10% of total time.
 */
export function isTimeWarning(
  remainingSeconds: number,
  totalSeconds: number
): boolean {
  if (remainingSeconds <= 0) return false;
  const fiveMinutes = 5 * 60;
  const tenPercent = totalSeconds * 0.1;
  return remainingSeconds < fiveMinutes || remainingSeconds < tenPercent;
}

/**
 * Returns true if the remaining time is in a critical state:
 * less than 60 seconds remaining.
 */
export function isTimeCritical(remainingSeconds: number): boolean {
  return remainingSeconds > 0 && remainingSeconds < 60;
}
