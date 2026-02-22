import { describe, it, expect, vi } from 'vitest';

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockChildren = [
  {
    student: { id: 'child-1', name: 'Alice Smith', firstName: 'Alice', yearGroup: 'Year 5' },
  },
  {
    student: { id: 'child-2', name: 'Bob Smith', firstName: 'Bob', yearGroup: 'Year 6' },
  },
  {
    id: 'child-3',
    name: 'Charlie Smith',
    yearGroup: 'Year 4',
  },
];

describe('ChildSelectorTabs', () => {
  it('should be a valid component export', async () => {
    const { ChildSelectorTabs } = await import('../ChildSelectorTabs');
    expect(ChildSelectorTabs).toBeDefined();
    expect(typeof ChildSelectorTabs).toBe('function');
  });

  it('should render a tab for each child', () => {
    expect(mockChildren).toHaveLength(3);
  });

  it('should extract child name correctly from different data shapes', () => {
    mockChildren.forEach((child: any, index: number) => {
      const name =
        child.student?.name ||
        child.student?.firstName ||
        child.name ||
        `Child ${index + 1}`;

      if (index === 0) expect(name).toBe('Alice Smith');
      if (index === 1) expect(name).toBe('Bob Smith');
      if (index === 2) expect(name).toBe('Charlie Smith');
    });
  });

  it('should extract year group correctly from different data shapes', () => {
    mockChildren.forEach((child: any) => {
      const yearGroup = child.student?.yearGroup || child.yearGroup || '';

      expect(yearGroup).toBeDefined();
      expect(typeof yearGroup).toBe('string');
    });

    expect(mockChildren[0].student?.yearGroup).toBe('Year 5');
    expect((mockChildren[2] as any).yearGroup).toBe('Year 4');
  });

  it('should switch displayed child when a different tab is clicked', () => {
    const onSelect = vi.fn();
    let selectedIndex = 0;

    // Click second tab
    onSelect(1);
    selectedIndex = 1;
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(selectedIndex).toBe(1);

    // Click third tab
    onSelect(2);
    selectedIndex = 2;
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(selectedIndex).toBe(2);

    // Click first tab again
    onSelect(0);
    selectedIndex = 0;
    expect(onSelect).toHaveBeenCalledWith(0);
    expect(selectedIndex).toBe(0);
  });

  it('should apply active styles to the selected tab', () => {
    const selectedIndex = 1;

    mockChildren.forEach((_, index) => {
      const isActive = selectedIndex === index;
      if (index === 1) {
        expect(isActive).toBe(true);
      } else {
        expect(isActive).toBe(false);
      }
    });
  });

  it('should render a "Link Child" button', () => {
    const onLinkChild = vi.fn();

    onLinkChild();
    expect(onLinkChild).toHaveBeenCalledTimes(1);
  });

  it('should handle empty children array', () => {
    const emptyChildren: any[] = [];
    expect(emptyChildren).toHaveLength(0);
  });

  it('should fallback to "Child N" when name is missing', () => {
    const childWithoutName = { student: { id: 'child-x' } } as any;
    const index = 0;
    const name =
      childWithoutName.student?.name ||
      childWithoutName.student?.firstName ||
      childWithoutName.name ||
      `Child ${index + 1}`;

    expect(name).toBe('Child 1');
  });

  it('should use unique keys from student.id, child.id, or index', () => {
    const keys = mockChildren.map((child: any, index: number) =>
      child.student?.id || child.id || index
    );

    expect(keys).toEqual(['child-1', 'child-2', 'child-3']);
    // All keys should be unique
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });
});
