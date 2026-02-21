'use client';

import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { layoutClasses } from './classes';

export function HeaderSection({
  slots,
  className,
  disableElevation,
}) {
  const [isOffset, setIsOffset] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsOffset(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        layoutClasses.header,
        'sticky top-0 z-[var(--layout-header-zIndex)]',
        isOffset && 'bg-background/80 backdrop-blur-sm',
        !disableElevation && isOffset && 'shadow-sm',
        className
      )}
    >
      {slots?.topArea}

      <div className="mx-auto flex h-16 w-full items-center px-4 lg:h-[72px] lg:px-5">
        <div className="flex items-center gap-1">{slots?.leftArea}</div>
        <div className="flex flex-1 justify-center">{slots?.centerArea}</div>
        <div className="flex items-center gap-1 sm:gap-2">{slots?.rightArea}</div>
      </div>

      {slots?.bottomArea}
    </header>
  );
}
