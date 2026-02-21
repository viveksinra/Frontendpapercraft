'use client';

import { cn } from '@/lib/utils';

import { layoutClasses } from '../core';

export function AuthSplitContent({ children, className }) {
  return (
    <div
      className={cn(
        layoutClasses.content,
        'flex flex-1 flex-col items-center px-4 pt-6 pb-20 md:justify-center md:py-20',
        className
      )}
    >
      <div className="flex w-full max-w-[var(--layout-auth-content-width)] flex-col">
        {children}
      </div>
    </div>
  );
}
