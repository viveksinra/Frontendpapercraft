'use client';

import { cn } from '@/lib/utils';
import { layoutClasses } from './classes';
import { layoutSectionVars } from './css-vars';

export function LayoutSection({
  children,
  footerSection,
  headerSection,
  sidebarSection,
  cssVars,
  className,
}) {
  const mergedVars = { ...layoutSectionVars(), ...cssVars };

  return (
    <div
      id="root__layout"
      className={cn(layoutClasses.root, 'flex min-h-screen flex-1 flex-col', className)}
      style={mergedVars}
    >
      {sidebarSection ? (
        <>
          {sidebarSection}
          <div className={cn(layoutClasses.sidebarContainer, 'flex flex-1 flex-col transition-[padding-left] duration-[var(--layout-transition-duration)] ease-[var(--layout-transition-easing)] lg:pl-[var(--layout-nav-vertical-width)]')}>
            {headerSection}
            {children}
            {footerSection}
          </div>
        </>
      ) : (
        <>
          {headerSection}
          {children}
          {footerSection}
        </>
      )}
    </div>
  );
}
