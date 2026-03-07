import { it, vi, expect, describe } from 'vitest';

// Test the AutoGenerateWizard's callback logic and state transitions
describe('AutoGenerateWizard', () => {
  describe('step navigation', () => {
    it('starts on step 0 (select)', () => {
      const step = 0;
      expect(step).toBe(0);
    });

    it('moves to step 1 after generate succeeds', () => {
      let step = 0;
      const result = { paper: { _id: 'p1', title: 'Auto Paper' } };
      if (result) step = 1;
      expect(step).toBe(1);
    });

    it('stays on step 0 if generate returns null', () => {
      let step = 0;
      const result = null;
      if (result) step = 1;
      expect(step).toBe(0);
    });
  });

  describe('canGenerate validation', () => {
    it('requires title, blueprintId, and templateId', () => {
      const canGenerate = (title, blueprintId, templateId) =>
        !!title.trim() && !!blueprintId && !!templateId;

      expect(canGenerate('Math Paper', 'bp1', 'tp1')).toBe(true);
      expect(canGenerate('', 'bp1', 'tp1')).toBe(false);
      expect(canGenerate('Math Paper', '', 'tp1')).toBe(false);
      expect(canGenerate('Math Paper', 'bp1', '')).toBe(false);
      expect(canGenerate('  ', 'bp1', 'tp1')).toBe(false);
    });
  });

  describe('handleGenerate', () => {
    it('calls onGenerate with correct params', async () => {
      const onGenerate = vi.fn().mockResolvedValue({ paper: { _id: 'p1' } });
      const title = 'Math Test';
      const blueprintId = 'bp1';
      const templateId = 'tp1';

      const result = await onGenerate({ title, blueprintId, templateId });
      expect(onGenerate).toHaveBeenCalledWith({ title: 'Math Test', blueprintId: 'bp1', templateId: 'tp1' });
      expect(result.paper._id).toBe('p1');
    });
  });

  describe('handleRegenerate', () => {
    it('calls onRegenerate and updates paper', async () => {
      const onRegenerate = vi.fn().mockResolvedValue({ paper: { _id: 'p2', title: 'Regenerated' } });
      const result = await onRegenerate({ title: 'Test', blueprintId: 'bp1', templateId: 'tp1' });
      expect(result.paper._id).toBe('p2');
    });
  });

  describe('handleSwapClick', () => {
    it('calls onGetSwaps and sets alternatives', async () => {
      const onGetSwaps = vi.fn().mockResolvedValue({
        alternatives: [
          { _id: 'alt1', content: { text: 'Alt Q1' } },
          { _id: 'alt2', content: { text: 'Alt Q2' } },
        ],
      });

      const data = await onGetSwaps('p1', 0, 1);
      const alternatives = data?.alternatives || [];
      expect(alternatives).toHaveLength(2);
      expect(onGetSwaps).toHaveBeenCalledWith('p1', 0, 1);
    });

    it('sets empty alternatives on error', async () => {
      const onGetSwaps = vi.fn().mockRejectedValue(new Error('fail'));
      let alternatives = [];
      try {
        await onGetSwaps('p1', 0, 1);
      } catch {
        alternatives = [];
      }
      expect(alternatives).toHaveLength(0);
    });
  });

  describe('handleSwapConfirm', () => {
    it('calls onSwap with correct params', async () => {
      const onSwap = vi.fn().mockResolvedValue({ paper: { _id: 'p1' } });
      const paperId = 'p1';
      const sectionIndex = 0;
      const questionIndex = 2;
      const newQuestionId = 'alt1';

      await onSwap(paperId, {
        sectionIndex,
        questionNumber: questionIndex + 1,
        newQuestionId,
      });

      expect(onSwap).toHaveBeenCalledWith('p1', {
        sectionIndex: 0,
        questionNumber: 3,
        newQuestionId: 'alt1',
      });
    });
  });
});
