'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { layoutClasses } from '../core';
import { NavSectionVertical } from '../components/nav-section-vertical';

export function NavVertical({
  data,
  className,
  isNavMini,
  onToggleNav,
  checkPermissions,
}) {
  return (
    <nav
      className={cn(
        layoutClasses.nav.root,
        layoutClasses.nav.vertical,
        'fixed inset-y-0 left-0 z-[var(--layout-nav-zIndex)] hidden flex-col border-r border-border bg-background transition-[width] duration-[var(--layout-transition-duration)] ease-[var(--layout-transition-easing)] lg:flex',
        isNavMini ? 'w-[var(--layout-nav-mini-width)]' : 'w-[var(--layout-nav-vertical-width)]',
        className
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggleNav}
        className="absolute top-9 z-[var(--layout-nav-zIndex)] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-1 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:flex"
        style={{
          left: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
        }}
      >
        {isNavMini ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Logo */}
      <div className={cn('py-5', isNavMini ? 'flex justify-center' : 'pl-7')}>
        <Logo />
      </div>

      {/* Navigation */}
      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          isNavMini={isNavMini}
          checkPermissions={checkPermissions}
        />
      </Scrollbar>
    </nav>
  );
}
