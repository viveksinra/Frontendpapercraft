'use client';

import { Logo } from 'src/components/logo';

import { MainSection, LayoutSection, HeaderSection } from '../core';

export function SimpleLayout({ children }) {
  const headerSlots = {
    leftArea: <Logo />,
    rightArea: (
      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Need help?
      </a>
    ),
  };

  return (
    <LayoutSection headerSection={<HeaderSection slots={headerSlots} />}>
      <MainSection>{children}</MainSection>
    </LayoutSection>
  );
}
