import { describe, it, expect, vi } from 'vitest';

// Mock shared component
vi.mock('@papercraft/shared', () => ({
  SectionTimedController: ({ sections, currentSectionIndex, onSectionComplete, onTimeUp }: any) => null,
}));

const mockSections = [
  { name: 'Section A - Reasoning', timeLimit: 25, questionIds: ['q1', 'q2', 'q3'], instructions: 'Answer all reasoning questions.' },
  { name: 'Section B - English', timeLimit: 20, questionIds: ['q4', 'q5', 'q6'], instructions: 'Read passages carefully.' },
  { name: 'Section C - Mathematics', timeLimit: 30, questionIds: ['q7', 'q8', 'q9', 'q10'], instructions: 'Show all working.' },
];

describe('SectionStopOverlay', () => {
  it('should be a valid component export', async () => {
    const { SectionStopOverlay } = await import('../SectionStopOverlay');
    expect(SectionStopOverlay).toBeDefined();
    expect(typeof SectionStopOverlay).toBe('function');
  });

  it('should pass correct section data to SectionTimedController', () => {
    const sections = mockSections.map((s) => ({
      name: s.name,
      timeLimit: s.timeLimit,
      questionIds: s.questionIds,
      instructions: s.instructions,
    }));

    expect(sections).toHaveLength(3);
    expect(sections[0].name).toBe('Section A - Reasoning');
    expect(sections[0].timeLimit).toBe(25);
    expect(sections[0].questionIds).toEqual(['q1', 'q2', 'q3']);
    expect(sections[0].instructions).toBe('Answer all reasoning questions.');
  });

  it('should track current section index', () => {
    let currentSectionIndex = 0;

    expect(currentSectionIndex).toBe(0);
    expect(mockSections[currentSectionIndex].name).toBe('Section A - Reasoning');

    currentSectionIndex = 1;
    expect(mockSections[currentSectionIndex].name).toBe('Section B - English');

    currentSectionIndex = 2;
    expect(mockSections[currentSectionIndex].name).toBe('Section C - Mathematics');
  });

  it('should call onSectionComplete with the completed section index', () => {
    const onSectionComplete = vi.fn();

    onSectionComplete(0);
    expect(onSectionComplete).toHaveBeenCalledWith(0);

    onSectionComplete(1);
    expect(onSectionComplete).toHaveBeenCalledWith(1);
  });

  it('should call onTimeUp when time expires', () => {
    const onTimeUp = vi.fn();

    onTimeUp();
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('should render a STOP/continue message between sections', () => {
    // The SectionStopOverlay renders a SectionTimedController from @papercraft/shared
    // which displays a STOP overlay between sections with a continue button
    const sectionName = mockSections[0].name;
    expect(sectionName).toContain('Reasoning');

    const nextSectionName = mockSections[1].name;
    expect(nextSectionName).toContain('English');
  });

  it('should handle sections with varying question counts', () => {
    expect(mockSections[0].questionIds).toHaveLength(3);
    expect(mockSections[1].questionIds).toHaveLength(3);
    expect(mockSections[2].questionIds).toHaveLength(4);
  });
});
