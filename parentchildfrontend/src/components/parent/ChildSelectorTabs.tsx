'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChildSelectorTabsProps {
  linkedChildren: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onLinkChild?: () => void;
}

export function ChildSelectorTabs({
  linkedChildren,
  selectedIndex,
  onSelect,
  onLinkChild,
}: ChildSelectorTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b pb-px scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Select child">
      {linkedChildren.map((child: any, index: number) => {
        const name =
          child.student?.name ||
          child.student?.firstName ||
          child.name ||
          `Child ${index + 1}`;
        const yearGroup =
          child.student?.yearGroup || child.yearGroup || '';

        return (
          <button
            key={child.student?.id || child.id || index}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            onClick={() => onSelect(index)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors',
              selectedIndex === index
                ? 'border-b-2 border-primary bg-background text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <span>{name}</span>
            {yearGroup && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs',
                  selectedIndex === index
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {yearGroup}
              </span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onLinkChild}
        className="flex shrink-0 items-center gap-1.5 rounded-t-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        <span>Link Child</span>
      </button>
    </div>
  );
}
