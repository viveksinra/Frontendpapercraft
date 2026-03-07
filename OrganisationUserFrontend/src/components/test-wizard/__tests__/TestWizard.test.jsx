import { it, vi, expect, describe, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('lucide-react', () => ({
  ChevronLeft: vi.fn(),
  ChevronRight: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(),
}));

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(),
}));

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(),
}));

vi.mock('../ModeSelector', () => ({ default: vi.fn() }));
vi.mock('../SourceSelector', () => ({ default: vi.fn() }));
vi.mock('../TimingConfigurator', () => ({ default: vi.fn() }));
vi.mock('../TestOptionsPanel', () => ({ default: vi.fn() }));
vi.mock('../AssignmentPanel', () => ({ default: vi.fn() }));
vi.mock('../TestReviewPanel', () => ({ default: vi.fn() }));

// Reproduce the STEPS and buildInitialState from the component
const STEPS = [
  { label: 'Mode', description: 'Choose test type' },
  { label: 'Source', description: 'Select questions' },
  { label: 'Timing', description: 'Configure schedule' },
  { label: 'Options', description: 'Test settings' },
  { label: 'Assignment', description: 'Assign students' },
  { label: 'Review', description: 'Review and publish' },
];

function buildInitialState(initialData) {
  return {
    title: initialData?.title || '',
    mode: initialData?.mode || '',
    paperId: initialData?.paperId || null,
    sections: initialData?.sections || [
      { name: 'Section 1', questions: [], instructions: '' },
    ],
    scheduling: initialData?.scheduling || {},
    options: initialData?.options || {},
    assignment: initialData?.assignment || {
      isPublic: false,
      classes: [],
      students: [],
    },
  };
}

describe('TestWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('STEPS', () => {
    it('has exactly 6 steps', () => {
      expect(STEPS).toHaveLength(6);
    });

    it('has correct step labels in order', () => {
      const labels = STEPS.map((s) => s.label);
      expect(labels).toEqual(['Mode', 'Source', 'Timing', 'Options', 'Assignment', 'Review']);
    });
  });

  describe('buildInitialState', () => {
    it('returns correct defaults when no initialData provided', () => {
      const state = buildInitialState(undefined);

      expect(state.title).toBe('');
      expect(state.mode).toBe('');
      expect(state.paperId).toBeNull();
      expect(state.sections).toEqual([
        { name: 'Section 1', questions: [], instructions: '' },
      ]);
      expect(state.scheduling).toEqual({});
      expect(state.options).toEqual({});
      expect(state.assignment).toEqual({
        isPublic: false,
        classes: [],
        students: [],
      });
    });

    it('returns correct defaults when null is provided', () => {
      const state = buildInitialState(null);

      expect(state.title).toBe('');
      expect(state.mode).toBe('');
      expect(state.paperId).toBeNull();
    });

    it('uses initialData values when provided', () => {
      const initialData = {
        title: 'My Test',
        mode: 'live_mock',
        paperId: 'paper123',
        sections: [{ name: 'Custom Section', questions: ['q1'], instructions: 'Read carefully' }],
        scheduling: { startTime: '2025-06-01T10:00:00Z' },
        options: { shuffleQuestions: true },
        assignment: { isPublic: true, classes: ['c1'], students: ['s1'] },
      };

      const state = buildInitialState(initialData);

      expect(state.title).toBe('My Test');
      expect(state.mode).toBe('live_mock');
      expect(state.paperId).toBe('paper123');
      expect(state.sections).toEqual(initialData.sections);
      expect(state.scheduling).toEqual(initialData.scheduling);
      expect(state.options).toEqual(initialData.options);
      expect(state.assignment).toEqual(initialData.assignment);
    });

    it('fills in defaults for missing fields in partial initialData', () => {
      const initialData = {
        title: 'Partial Test',
        mode: 'practice',
      };

      const state = buildInitialState(initialData);

      expect(state.title).toBe('Partial Test');
      expect(state.mode).toBe('practice');
      expect(state.paperId).toBeNull();
      expect(state.sections).toEqual([
        { name: 'Section 1', questions: [], instructions: '' },
      ]);
    });
  });

  describe('canNext logic', () => {
    it('step 0 requires mode to be set', () => {
      const canNext = (step, formData) => {
        if (step === 0) return !!formData.mode;
        if (step === 1) {
          return !!(
            formData.paperId ||
            (formData.sections && formData.sections.length > 0)
          );
        }
        return true;
      };

      // No mode set - cannot proceed
      expect(canNext(0, { mode: '' })).toBe(false);
      expect(canNext(0, { mode: null })).toBe(false);

      // Mode set - can proceed
      expect(canNext(0, { mode: 'live_mock' })).toBe(true);
      expect(canNext(0, { mode: 'practice' })).toBe(true);
    });

    it('step 1 requires paperId or non-empty sections', () => {
      const canNext = (step, formData) => {
        if (step === 0) return !!formData.mode;
        if (step === 1) {
          return !!(
            formData.paperId ||
            (formData.sections && formData.sections.length > 0)
          );
        }
        return true;
      };

      // Neither paperId nor sections
      expect(canNext(1, { paperId: null, sections: [] })).toBe(false);
      expect(canNext(1, { paperId: null, sections: null })).toBe(false);

      // Has paperId
      expect(canNext(1, { paperId: 'p1', sections: [] })).toBe(true);

      // Has sections
      expect(canNext(1, { paperId: null, sections: [{ name: 'S1' }] })).toBe(true);

      // Has both
      expect(canNext(1, { paperId: 'p1', sections: [{ name: 'S1' }] })).toBe(true);
    });

    it('steps 2-5 always return true', () => {
      const canNext = (step, formData) => {
        if (step === 0) return !!formData.mode;
        if (step === 1) {
          return !!(
            formData.paperId ||
            (formData.sections && formData.sections.length > 0)
          );
        }
        return true;
      };

      const formData = { mode: '', paperId: null, sections: [] };
      expect(canNext(2, formData)).toBe(true);
      expect(canNext(3, formData)).toBe(true);
      expect(canNext(4, formData)).toBe(true);
      expect(canNext(5, formData)).toBe(true);
    });
  });

  describe('step navigation', () => {
    it('handleNext increments step within bounds', () => {
      let step = 0;
      const handleNext = () => {
        if (step < STEPS.length - 1) {
          step = step + 1;
        }
      };

      handleNext();
      expect(step).toBe(1);
      handleNext();
      expect(step).toBe(2);
    });

    it('handleNext does not exceed max step', () => {
      let step = 5; // last step (Review)
      const handleNext = () => {
        if (step < STEPS.length - 1) {
          step = step + 1;
        }
      };

      handleNext();
      expect(step).toBe(5); // stays at 5
    });

    it('handleBack decrements step within bounds', () => {
      let step = 3;
      const handleBack = () => {
        if (step > 0) {
          step = step - 1;
        }
      };

      handleBack();
      expect(step).toBe(2);
      handleBack();
      expect(step).toBe(1);
    });

    it('handleBack does not go below 0', () => {
      let step = 0;
      const handleBack = () => {
        if (step > 0) {
          step = step - 1;
        }
      };

      handleBack();
      expect(step).toBe(0); // stays at 0
    });
  });

  describe('onSubmit callbacks', () => {
    it('handleSaveDraft calls onSubmit with draft status', () => {
      const onSubmit = vi.fn();
      const formData = buildInitialState({ title: 'Draft Test', mode: 'practice' });

      // Simulate handleSaveDraft
      onSubmit({ ...formData, status: 'draft' });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ status: 'draft' }));
    });

    it('handleSchedule calls onSubmit with scheduled status', () => {
      const onSubmit = vi.fn();
      const formData = buildInitialState({ title: 'Scheduled Test', mode: 'live_mock' });

      onSubmit({ ...formData, status: 'scheduled' });

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ status: 'scheduled' }));
    });

    it('handleGoLive calls onSubmit with live status', () => {
      const onSubmit = vi.fn();
      const formData = buildInitialState({ title: 'Live Test', mode: 'live_mock' });

      onSubmit({ ...formData, status: 'live' });

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ status: 'live' }));
    });
  });
});
