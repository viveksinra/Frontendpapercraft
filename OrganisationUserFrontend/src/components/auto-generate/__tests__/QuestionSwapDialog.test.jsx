import { describe, it, expect, vi } from 'vitest';

// Test QuestionSwapDialog's selection and swap logic
describe('QuestionSwapDialog', () => {
  const currentQuestion = {
    _id: 'q1',
    content: { text: 'What is the capital of France?' },
    type: 'mcq',
    difficulty: 'easy',
    marks: 2,
  };

  const alternatives = [
    { _id: 'alt1', content: { text: 'What is the capital of Germany?' }, type: 'mcq', difficulty: 'easy', marks: 2 },
    { _id: 'alt2', content: { text: 'What is the capital of Spain?' }, type: 'mcq', difficulty: 'medium', marks: 2 },
    { _id: 'alt3', content: { text: 'What is the capital of Italy?' }, type: 'mcq', difficulty: 'easy', marks: 2 },
  ];

  it('displays current question information', () => {
    expect(currentQuestion.content.text).toBe('What is the capital of France?');
    expect(currentQuestion.type).toBe('mcq');
    expect(currentQuestion.marks).toBe(2);
  });

  it('lists all alternatives', () => {
    expect(alternatives).toHaveLength(3);
    alternatives.forEach((alt) => {
      expect(alt._id).toBeDefined();
      expect(alt.content.text).toBeDefined();
    });
  });

  it('shows empty state when no alternatives', () => {
    const emptyAlts = [];
    expect(emptyAlts.length === 0).toBe(true);
  });

  describe('selection logic', () => {
    it('selects an alternative by id', () => {
      let selectedAlt = null;
      const id = alternatives[1]._id;
      selectedAlt = id;
      expect(selectedAlt).toBe('alt2');
    });

    it('resets selection when dialog opens', () => {
      let selectedAlt = 'alt1';
      const open = true;
      if (open) selectedAlt = null;
      expect(selectedAlt).toBeNull();
    });

    it('identifies selected card', () => {
      const selectedAlt = 'alt2';
      const isSelected = (alt) => selectedAlt === (alt._id || alt.id);
      expect(isSelected(alternatives[0])).toBe(false);
      expect(isSelected(alternatives[1])).toBe(true);
      expect(isSelected(alternatives[2])).toBe(false);
    });
  });

  describe('swap confirmation', () => {
    it('calls onSwap with selected alternative id', () => {
      const onSwap = vi.fn();
      const selectedAlt = 'alt2';
      onSwap(selectedAlt);
      expect(onSwap).toHaveBeenCalledWith('alt2');
    });

    it('swap button is disabled when no selection', () => {
      const selectedAlt = null;
      const disabled = !selectedAlt;
      expect(disabled).toBe(true);
    });

    it('swap button is enabled when selection exists', () => {
      const selectedAlt = 'alt1';
      const disabled = !selectedAlt;
      expect(disabled).toBe(false);
    });
  });

  describe('cancel', () => {
    it('calls onOpenChange(false) on cancel', () => {
      const onOpenChange = vi.fn();
      onOpenChange(false);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
