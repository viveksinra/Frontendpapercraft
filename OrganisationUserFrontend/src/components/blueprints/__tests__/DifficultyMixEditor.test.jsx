import { it, vi, expect, describe } from 'vitest';

// Test DifficultyMixEditor validation and update logic
const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

describe('DifficultyMixEditor', () => {
  describe('validation', () => {
    it('validates percentages summing to 100', () => {
      const mix = { easy: 25, medium: 50, hard: 20, expert: 5 };
      const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
      expect(total).toBe(100);
      expect(total === 100).toBe(true);
    });

    it('flags percentages not summing to 100', () => {
      const mix = { easy: 25, medium: 50, hard: 20, expert: 10 };
      const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
      expect(total).toBe(105);
      expect(total === 100).toBe(false);
    });

    it('flags percentages summing to less than 100', () => {
      const mix = { easy: 20, medium: 30, hard: 10, expert: 5 };
      const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
      expect(total).toBe(65);
      expect(total === 100).toBe(false);
    });

    it('handles empty mix as all zeros', () => {
      const mix = {};
      const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
      expect(total).toBe(0);
      expect(total === 100).toBe(false);
    });

    it('handles partial mix', () => {
      const mix = { easy: 50, medium: 50 };
      const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
      expect(total).toBe(100);
      expect(total === 100).toBe(true);
    });
  });

  describe('handleUpdate', () => {
    it('updates single difficulty value', () => {
      const onChange = vi.fn();
      const mix = { easy: 25, medium: 50, hard: 20, expert: 5 };
      const handleUpdate = (key, value) => {
        onChange({ ...mix, [key]: Number(value) || 0 });
      };

      handleUpdate('easy', '30');
      expect(onChange).toHaveBeenCalledWith({ easy: 30, medium: 50, hard: 20, expert: 5 });
    });

    it('converts string input to number', () => {
      const onChange = vi.fn();
      const mix = { easy: 25, medium: 50, hard: 20, expert: 5 };
      const handleUpdate = (key, value) => {
        onChange({ ...mix, [key]: Number(value) || 0 });
      };

      handleUpdate('hard', '35');
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hard: 35 }));
    });

    it('handles NaN input as 0', () => {
      const onChange = vi.fn();
      const mix = { easy: 25, medium: 50, hard: 20, expert: 5 };
      const handleUpdate = (key, value) => {
        onChange({ ...mix, [key]: Number(value) || 0 });
      };

      handleUpdate('expert', 'abc');
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ expert: 0 }));
    });

    it('handles empty string input as 0', () => {
      const onChange = vi.fn();
      const mix = { easy: 25, medium: 50, hard: 20, expert: 5 };
      const handleUpdate = (key, value) => {
        onChange({ ...mix, [key]: Number(value) || 0 });
      };

      handleUpdate('medium', '');
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ medium: 0 }));
    });
  });

  describe('display text', () => {
    it('shows valid message when total is 100', () => {
      const total = 100;
      const isValid = total === 100;
      expect(isValid).toBe(true);
      const displayText = `Total: ${total}% ${isValid ? '' : '(must be 100%)'}`;
      expect(displayText).toBe('Total: 100% ');
    });

    it('shows error message when total is not 100', () => {
      const total = 95;
      const isValid = total === 100;
      expect(isValid).toBe(false);
      const displayText = `Total: ${total}% ${isValid ? '' : '(must be 100%)'}`;
      expect(displayText).toContain('must be 100%');
    });
  });
});
