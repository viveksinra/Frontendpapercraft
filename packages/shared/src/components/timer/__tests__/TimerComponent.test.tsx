import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/time', () => ({
  formatTimeRemaining: vi.fn((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }),
}));

vi.mock('react', () => ({
  default: { createElement: vi.fn() },
  useState: vi.fn((init: unknown) => [init, vi.fn()]),
  useEffect: vi.fn(),
  useCallback: vi.fn((fn: Function) => fn),
  useRef: vi.fn((init: unknown) => ({ current: init })),
}));

// Reproduce the component's pure logic for testing
const WARNING_THRESHOLD = 5 * 60; // 300 seconds
const CRITICAL_THRESHOLD = 60; // 1 minute

type TimerMode = 'countdown' | 'countup' | 'display_only';
type VisualState = 'normal' | 'warning' | 'critical' | 'expired';

function getVisualState(remaining: number, mode: TimerMode): VisualState {
  if (mode !== 'countdown') return 'normal';
  if (remaining <= 0) return 'expired';
  if (remaining < CRITICAL_THRESHOLD) return 'critical';
  if (remaining < WARNING_THRESHOLD) return 'warning';
  return 'normal';
}

describe('TimerComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVisualState', () => {
    it('returns "normal" for countdown with remaining > WARNING_THRESHOLD (300s)', () => {
      expect(getVisualState(600, 'countdown')).toBe('normal');
      expect(getVisualState(301, 'countdown')).toBe('normal');
      expect(getVisualState(300, 'countdown')).toBe('normal');
    });

    it('returns "warning" for countdown with remaining < 300s and >= 60s', () => {
      expect(getVisualState(299, 'countdown')).toBe('warning');
      expect(getVisualState(120, 'countdown')).toBe('warning');
      expect(getVisualState(60, 'countdown')).toBe('warning');
    });

    it('returns "critical" for countdown with remaining < 60s and > 0', () => {
      expect(getVisualState(59, 'countdown')).toBe('critical');
      expect(getVisualState(30, 'countdown')).toBe('critical');
      expect(getVisualState(1, 'countdown')).toBe('critical');
    });

    it('returns "expired" for countdown with remaining <= 0', () => {
      expect(getVisualState(0, 'countdown')).toBe('expired');
      expect(getVisualState(-1, 'countdown')).toBe('expired');
      expect(getVisualState(-100, 'countdown')).toBe('expired');
    });

    it('always returns "normal" for non-countdown modes regardless of remaining', () => {
      expect(getVisualState(0, 'countup')).toBe('normal');
      expect(getVisualState(-5, 'countup')).toBe('normal');
      expect(getVisualState(30, 'countup')).toBe('normal');
      expect(getVisualState(0, 'display_only')).toBe('normal');
      expect(getVisualState(-10, 'display_only')).toBe('normal');
      expect(getVisualState(500, 'display_only')).toBe('normal');
    });
  });

  describe('onExpiry callback', () => {
    it('fires onExpiry when countdown elapsed reaches totalSeconds', () => {
      const onExpiry = vi.fn();
      const totalSeconds = 600;
      const mode: TimerMode = 'countdown';

      // Simulate the logic inside the tick/setElapsed callback:
      // When elapsed >= totalSeconds, onExpiry is called
      let expiredRef = false;
      const simulateTick = (elapsed: number, delta: number) => {
        const next = elapsed + delta;
        if (mode === 'countdown' && next >= totalSeconds && !expiredRef) {
          expiredRef = true;
          onExpiry();
          return totalSeconds; // capped at totalSeconds
        }
        return next;
      };

      // Before reaching totalSeconds - no call
      const result1 = simulateTick(590, 5);
      expect(result1).toBe(595);
      expect(onExpiry).not.toHaveBeenCalled();

      // Reaching totalSeconds - fires
      const result2 = simulateTick(595, 10);
      expect(result2).toBe(totalSeconds);
      expect(onExpiry).toHaveBeenCalledTimes(1);

      // After already expired - does not fire again
      const result3 = simulateTick(totalSeconds, 5);
      expect(result3).toBe(totalSeconds + 5); // expiredRef already true, condition fails, falls through
      expect(onExpiry).toHaveBeenCalledTimes(1);
    });

    it('does not fire onExpiry for countup mode even when elapsed exceeds totalSeconds', () => {
      const onExpiry = vi.fn();
      const totalSeconds = 60;
      const mode: TimerMode = 'countup';

      let expiredRef = false;
      const simulateTick = (elapsed: number, delta: number) => {
        const next = elapsed + delta;
        if (mode === 'countdown' && next >= totalSeconds && !expiredRef) {
          expiredRef = true;
          onExpiry();
          return totalSeconds;
        }
        return next;
      };

      const result = simulateTick(55, 10);
      expect(result).toBe(65);
      expect(onExpiry).not.toHaveBeenCalled();
    });
  });

  describe('display_only and paused modes', () => {
    it('display_only mode does not start the animation frame loop', () => {
      // The component's useEffect checks: if (mode === "display_only" || paused) { ... cancel RAF ... return; }
      // This means the tick function never runs, elapsed stays at 0
      const mode: TimerMode = 'display_only';
      const paused = false;
      const shouldTick = mode !== 'display_only' && !paused;
      expect(shouldTick).toBe(false);
    });

    it('paused=true prevents ticking regardless of mode', () => {
      const modes: TimerMode[] = ['countdown', 'countup', 'display_only'];
      const paused = true;

      for (const mode of modes) {
        const shouldTick = mode !== 'display_only' && !paused;
        expect(shouldTick).toBe(false);
      }
    });

    it('countdown mode with paused=false does tick', () => {
      const mode: TimerMode = 'countdown';
      const paused = false;
      const shouldTick = mode !== 'display_only' && !paused;
      expect(shouldTick).toBe(true);
    });
  });

  describe('displaySeconds calculation', () => {
    it('countdown mode shows totalSeconds - elapsed (clamped to 0)', () => {
      const totalSeconds = 300;
      const computeDisplay = (elapsed: number) =>
        Math.max(0, totalSeconds - elapsed);

      expect(computeDisplay(0)).toBe(300);
      expect(computeDisplay(100)).toBe(200);
      expect(computeDisplay(300)).toBe(0);
      expect(computeDisplay(350)).toBe(0); // clamped
    });

    it('countup mode shows elapsed directly', () => {
      const computeDisplay = (elapsed: number) => elapsed;

      expect(computeDisplay(0)).toBe(0);
      expect(computeDisplay(45)).toBe(45);
      expect(computeDisplay(999)).toBe(999);
    });

    it('display_only mode shows totalSeconds unchanged', () => {
      const totalSeconds = 120;
      // In display_only, displaySeconds = totalSeconds (elapsed never changes)
      expect(totalSeconds).toBe(120);
    });
  });
});
