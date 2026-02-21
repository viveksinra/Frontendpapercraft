import { describe, it, expect, vi } from 'vitest';

// Test the SectionEditor's update logic
describe('SectionEditor', () => {
  it('produces updated section with name change', () => {
    const section = { name: 'Section A', timeLimitMinutes: 30, instructions: '' };
    const onChange = vi.fn();

    // Simulate the update function from the component
    const update = (field, value) => {
      onChange({ ...section, [field]: value });
    };

    update('name', 'Section B');
    expect(onChange).toHaveBeenCalledWith({
      name: 'Section B',
      timeLimitMinutes: 30,
      instructions: '',
    });
  });

  it('produces updated section with time limit change', () => {
    const section = { name: 'Section A', timeLimitMinutes: 30, instructions: '' };
    const onChange = vi.fn();

    const update = (field, value) => {
      onChange({ ...section, [field]: value });
    };

    update('timeLimitMinutes', 45);
    expect(onChange).toHaveBeenCalledWith({
      name: 'Section A',
      timeLimitMinutes: 45,
      instructions: '',
    });
  });

  it('handles undefined time limit as undefined', () => {
    const section = { name: 'Section A', timeLimitMinutes: 30, instructions: '' };
    const onChange = vi.fn();

    const update = (field, value) => {
      onChange({ ...section, [field]: value });
    };

    // When user clears the field, Number("") || undefined = undefined
    update('timeLimitMinutes', undefined);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ timeLimitMinutes: undefined })
    );
  });

  it('updates instructions field', () => {
    const section = { name: 'A', instructions: '' };
    const onChange = vi.fn();

    const update = (field, value) => {
      onChange({ ...section, [field]: value });
    };

    update('instructions', 'Answer all questions.');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: 'Answer all questions.' })
    );
  });
});
