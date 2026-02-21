import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export function NavToggleButton({ isNavMini, className, ...other }) {
  return (
    <button
      className={cn(
        'absolute top-9 z-[1200] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-1 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:flex',
        className
      )}
      style={{
        left: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
      }}
      {...other}
    >
      {isNavMini ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </button>
  );
}
