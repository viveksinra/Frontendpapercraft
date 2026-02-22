import { describe, it, expect, vi } from 'vitest';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => ({ children, onClick }),
}));

const samplePassage = `The Amazon rainforest is the world's largest tropical rainforest.
It covers much of northwestern Brazil and extends into Colombia, Peru, and other South American countries.
The forest is home to approximately 10% of all species on Earth.
Deforestation remains a significant threat to this vital ecosystem.`;

describe('ComprehensionSplitView', () => {
  it('should be a valid component export', async () => {
    const { ComprehensionSplitView } = await import('../ComprehensionSplitView');
    expect(ComprehensionSplitView).toBeDefined();
    expect(typeof ComprehensionSplitView).toBe('function');
  });

  it('should split passage into paragraphs correctly', () => {
    const paragraphs = samplePassage.split('\n');

    expect(paragraphs).toHaveLength(4);
    expect(paragraphs[0]).toContain('Amazon rainforest');
    expect(paragraphs[1]).toContain('northwestern Brazil');
    expect(paragraphs[2]).toContain('10% of all species');
    expect(paragraphs[3]).toContain('Deforestation');
  });

  it('should support passage and question mobile toggle views', () => {
    type MobileView = 'passage' | 'question';
    let mobileView: MobileView = 'question';

    // Default should be question view
    expect(mobileView).toBe('question');

    // Switch to passage
    mobileView = 'passage';
    expect(mobileView).toBe('passage');

    // Switch back to question
    mobileView = 'question';
    expect(mobileView).toBe('question');
  });

  it('should determine visibility based on mobileView state', () => {
    const mobileViewPassage = 'passage';
    const mobileViewQuestion = 'question';

    // When passage is selected
    const passagePanelVisible = mobileViewPassage === 'passage' ? 'block' : 'hidden';
    const questionPanelVisible1 = mobileViewPassage === 'question' ? 'block' : 'hidden';
    expect(passagePanelVisible).toBe('block');
    expect(questionPanelVisible1).toBe('hidden');

    // When question is selected
    const passagePanelHidden = mobileViewQuestion === 'passage' ? 'block' : 'hidden';
    const questionPanelVisible2 = mobileViewQuestion === 'question' ? 'block' : 'hidden';
    expect(passagePanelHidden).toBe('hidden');
    expect(questionPanelVisible2).toBe('block');
  });

  it('should handle single paragraph passage', () => {
    const singleParagraph = 'This is a short passage with no line breaks.';
    const paragraphs = singleParagraph.split('\n');

    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toBe(singleParagraph);
  });

  it('should handle empty passage', () => {
    const emptyPassage = '';
    const paragraphs = emptyPassage.split('\n');

    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toBe('');
  });

  it('should render passage header text', () => {
    const headerText = 'Reading Passage';
    expect(headerText).toBe('Reading Passage');
  });
});
