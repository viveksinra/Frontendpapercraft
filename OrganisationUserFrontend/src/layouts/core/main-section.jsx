'use client';

import { cn } from '@/lib/utils';
import { layoutClasses } from './classes';

export function MainSection({ children, className, ...other }) {
  return (
    <main className={cn(layoutClasses.main, 'flex flex-1 flex-col', className)} {...other}>
      {children}
    </main>
  );
}
