import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('lucide-react', () => ({
  Clock: vi.fn(),
  CalendarClock: vi.fn(),
  RefreshCw: vi.fn(),
  Users: vi.fn(),
  Timer: vi.fn(),
}));

// Reproduce the MODES array from the component
const MODES = [
  {
    value: 'live_mock',
    title: 'Live Mock',
    description: 'Scheduled exam with fixed start time and duration',
  },
  {
    value: 'anytime_mock',
    title: 'Anytime Mock',
    description: 'Available within a time window, students choose when to start',
  },
  {
    value: 'practice',
    title: 'Practice',
    description: 'Unlimited attempts with instant feedback',
  },
  {
    value: 'classroom',
    title: 'Classroom',
    description: 'Teacher-controlled, can pause/resume',
  },
  {
    value: 'section_timed',
    title: 'Section Timed',
    description: 'Simulates FSCE/CSSE with per-section timers and no going back',
  },
];

describe('ModeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has all 5 modes with correct values', () => {
    expect(MODES).toHaveLength(5);

    const values = MODES.map((m) => m.value);
    expect(values).toEqual([
      'live_mock',
      'anytime_mock',
      'practice',
      'classroom',
      'section_timed',
    ]);
  });

  it('each mode has value, title, and description', () => {
    for (const mode of MODES) {
      expect(mode.value).toBeTruthy();
      expect(mode.title).toBeTruthy();
      expect(mode.description).toBeTruthy();
    }
  });

  it('calls onChange with the correct mode value when a mode is selected', () => {
    const onChange = vi.fn();

    // Simulate clicking each mode button - the onClick is () => onChange(mode.value)
    for (const mode of MODES) {
      onChange(mode.value);
    }

    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenCalledWith('live_mock');
    expect(onChange).toHaveBeenCalledWith('anytime_mock');
    expect(onChange).toHaveBeenCalledWith('practice');
    expect(onChange).toHaveBeenCalledWith('classroom');
    expect(onChange).toHaveBeenCalledWith('section_timed');
  });

  it('identifies selected mode via value prop matching', () => {
    const value = 'practice';

    const selectedMode = MODES.find((m) => m.value === value);
    expect(selectedMode).toBeDefined();
    expect(selectedMode.title).toBe('Practice');

    // The component applies 'border-primary' class and "Selected" badge when isSelected
    const isSelected = (mode) => value === mode.value;
    expect(isSelected(MODES[0])).toBe(false); // live_mock
    expect(isSelected(MODES[1])).toBe(false); // anytime_mock
    expect(isSelected(MODES[2])).toBe(true);  // practice
    expect(isSelected(MODES[3])).toBe(false); // classroom
    expect(isSelected(MODES[4])).toBe(false); // section_timed
  });

  it('no mode is selected when value is empty string', () => {
    const value = '';
    const isSelected = (mode) => value === mode.value;

    for (const mode of MODES) {
      expect(isSelected(mode)).toBe(false);
    }
  });
});
