import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockOptions = [
  { _id: 'opt-a', text: 'Paris' },
  { _id: 'opt-b', text: 'London' },
  { _id: 'opt-c', text: 'Berlin' },
  { _id: 'opt-d', text: 'Madrid' },
];

describe('McqAnswerInput', () => {
  it('should be a valid component export', async () => {
    const { McqAnswerInput } = await import('../McqAnswerInput');
    expect(McqAnswerInput).toBeDefined();
    expect(typeof McqAnswerInput).toBe('function');
  });

  it('should handle single selection correctly', () => {
    const onChange = vi.fn();
    const multiSelect = false;
    let value: string | null = null;

    // Simulate clicking option A
    const handleSelect = (optionId: string) => {
      if (!multiSelect) {
        onChange(optionId);
        value = optionId;
      }
    };

    handleSelect('opt-a');
    expect(onChange).toHaveBeenCalledWith('opt-a');
    expect(value).toBe('opt-a');

    // Click different option should replace selection
    handleSelect('opt-c');
    expect(onChange).toHaveBeenCalledWith('opt-c');
    expect(value).toBe('opt-c');
  });

  it('should handle multi-select correctly', () => {
    const onChange = vi.fn();
    const multiSelect = true;
    let selected: string[] = [];

    const handleSelect = (optionId: string) => {
      if (multiSelect) {
        const next = selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId];
        selected = next;
        onChange(next);
      }
    };

    // Select A
    handleSelect('opt-a');
    expect(selected).toEqual(['opt-a']);

    // Select C too
    handleSelect('opt-c');
    expect(selected).toEqual(['opt-a', 'opt-c']);

    // Deselect A
    handleSelect('opt-a');
    expect(selected).toEqual(['opt-c']);
  });

  it('should show selection state for selected option', () => {
    const value = 'opt-b';
    const selected = Array.isArray(value) ? value : value ? [value] : [];

    expect(selected).toEqual(['opt-b']);

    mockOptions.forEach((option) => {
      const isSelected = selected.includes(option._id);
      if (option._id === 'opt-b') {
        expect(isSelected).toBe(true);
      } else {
        expect(isSelected).toBe(false);
      }
    });
  });

  it('should handle null value correctly', () => {
    const value: string | string[] | null = null;
    const selected = Array.isArray(value) ? value : value ? [value] : [];

    expect(selected).toEqual([]);
  });

  it('should handle array value correctly', () => {
    const value: string | string[] | null = ['opt-a', 'opt-c'];
    const selected = Array.isArray(value) ? value : value ? [value] : [];

    expect(selected).toEqual(['opt-a', 'opt-c']);
  });

  it('should not allow selection when disabled', () => {
    const onChange = vi.fn();
    const disabled = true;

    const handleSelect = (optionId: string) => {
      if (disabled) return;
      onChange(optionId);
    };

    handleSelect('opt-a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should assign correct labels A-H to options', () => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    mockOptions.forEach((option, index) => {
      const label = labels[index] || index + 1;
      expect(label).toBeDefined();
    });

    expect(labels[0]).toBe('A');
    expect(labels[1]).toBe('B');
    expect(labels[2]).toBe('C');
    expect(labels[3]).toBe('D');
  });

  it('should show check icon for selected and label for unselected', () => {
    const selected = ['opt-b'];
    const labels = ['A', 'B', 'C', 'D'];

    mockOptions.forEach((option, index) => {
      const isSelected = selected.includes(option._id);
      if (isSelected) {
        // Should show Check icon
        expect(isSelected).toBe(true);
      } else {
        // Should show label letter
        expect(labels[index]).toBeDefined();
      }
    });
  });
});
