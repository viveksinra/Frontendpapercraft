import { it, vi, expect, describe } from 'vitest';

// Test BlueprintSectionCard's update logic
describe('BlueprintSectionCard', () => {
  const baseSection = {
    name: 'Section A',
    questionCount: 10,
    marksPerQuestion: 1,
    timeLimitMinutes: undefined,
    questionTypes: ['mcq'],
    instructions: '',
    topicDistribution: {},
    difficultyMix: { easy: 25, medium: 50, hard: 20, expert: 5 },
  };

  it('updates section name', () => {
    const onChange = vi.fn();
    const index = 0;
    const update = (field, value) => {
      onChange(index, { ...baseSection, [field]: value });
    };

    update('name', 'Section B - Long Answer');
    expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({ name: 'Section B - Long Answer' }));
  });

  it('updates question count', () => {
    const onChange = vi.fn();
    const index = 0;
    const update = (field, value) => {
      onChange(index, { ...baseSection, [field]: value });
    };

    update('questionCount', 20);
    expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({ questionCount: 20 }));
  });

  it('updates marks per question', () => {
    const onChange = vi.fn();
    const index = 1;
    const update = (field, value) => {
      onChange(index, { ...baseSection, [field]: value });
    };

    update('marksPerQuestion', 3);
    expect(onChange).toHaveBeenCalledWith(1, expect.objectContaining({ marksPerQuestion: 3 }));
  });

  it('parses question types from comma-separated string', () => {
    const input = 'mcq, short-answer, long-answer';
    const result = input.split(',').map((s) => s.trim()).filter(Boolean);
    expect(result).toEqual(['mcq', 'short-answer', 'long-answer']);
  });

  it('handles empty question types string', () => {
    const input = '';
    const result = input.split(',').map((s) => s.trim()).filter(Boolean);
    expect(result).toEqual([]);
  });

  it('updates difficulty mix', () => {
    const onChange = vi.fn();
    const index = 0;
    const update = (field, value) => {
      onChange(index, { ...baseSection, [field]: value });
    };

    const newMix = { easy: 30, medium: 40, hard: 20, expert: 10 };
    update('difficultyMix', newMix);
    expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({ difficultyMix: newMix }));
  });

  it('calls onRemove with correct index', () => {
    const onRemove = vi.fn();
    onRemove(2);
    expect(onRemove).toHaveBeenCalledWith(2);
  });
});
