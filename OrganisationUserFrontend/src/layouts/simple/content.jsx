'use client';

import { cn } from '@/lib/utils';

import { layoutClasses } from '../core';

export function SimpleCompactContent({ children, className }) {
  return (
    <div
      className={cn(
        layoutClasses.content,
        'mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-6 pb-20 text-center md:justify-center md:py-20',
        className
      )}
    >
      {children}
    </div>
  );
}
