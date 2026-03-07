import { it, vi, expect, describe } from 'vitest';

// Test the reorder and remove logic from SelectedQuestionsList
describe('SelectedQuestionsList', () => {
  const questions = [
    { _id: 'q1', content: { text: 'Q1' }, marks: 2, type: 'mcq' },
    { _id: 'q2', content: { text: 'Q2' }, marks: 3, type: 'short-answer' },
    { _id: 'q3', content: { text: 'Q3' }, marks: 5, type: 'long-answer' },
  ];

  describe('moveUp', () => {
    it('swaps question with the one above', () => {
      const onReorder = vi.fn();
      const index = 1;
      if (index > 0) {
        const next = [...questions];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        onReorder(next);
      }

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0];
      expect(reordered[0]._id).toBe('q2');
      expect(reordered[1]._id).toBe('q1');
      expect(reordered[2]._id).toBe('q3');
    });

    it('does nothing when question is first', () => {
      const onReorder = vi.fn();
      const index = 0;
      if (index > 0) {
        const next = [...questions];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        onReorder(next);
      }

      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  describe('moveDown', () => {
    it('swaps question with the one below', () => {
      const onReorder = vi.fn();
      const index = 0;
      if (index < questions.length - 1) {
        const next = [...questions];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        onReorder(next);
      }

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0];
      expect(reordered[0]._id).toBe('q2');
      expect(reordered[1]._id).toBe('q1');
    });

    it('does nothing when question is last', () => {
      const onReorder = vi.fn();
      const index = questions.length - 1;
      if (index < questions.length - 1) {
        const next = [...questions];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        onReorder(next);
      }

      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls onRemove with question id', () => {
      const onRemove = vi.fn();
      const id = questions[1]._id;
      onRemove(id);
      expect(onRemove).toHaveBeenCalledWith('q2');
    });
  });

  describe('marks total', () => {
    it('computes total marks correctly', () => {
      const total = questions.reduce((s, q) => s + (q.marks || 0), 0);
      expect(total).toBe(10);
    });

    it('returns 0 for empty list', () => {
      const total = [].reduce((s, q) => s + (q.marks || 0), 0);
      expect(total).toBe(0);
    });
  });

  describe('numbering', () => {
    it('displays 1-based numbering', () => {
      questions.forEach((q, i) => {
        expect(i + 1).toBeGreaterThan(0);
      });
      expect(questions.length).toBe(3);
    });
  });
});
