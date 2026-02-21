'use client';

import { cn } from '@/lib/utils';

import { layoutClasses } from '../core';

export function DashboardContent({
  children,
  className,
  disablePadding,
  ...other
}) {
  return (
    <div
      className={cn(
        layoutClasses.content,
        'mx-auto flex w-full max-w-7xl flex-1 flex-col',
        !disablePadding && 'px-4 pt-2 pb-16 lg:px-10',
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
}
