'use client';

import { Logo } from 'src/components/logo';

import { AuthSplitSection } from './section';
import { AuthSplitContent } from './content';
import { MainSection, LayoutSection, HeaderSection } from '../core';

export function AuthSplitLayout({ children }) {
  const headerSlots = {
    leftArea: <Logo />,
    rightArea: (
      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Need help?
      </a>
    ),
  };

  return (
    <LayoutSection
      headerSection={<HeaderSection disableElevation slots={headerSlots} />}
      cssVars={{ '--layout-auth-content-width': '420px' }}
    >
      <MainSection className="md:flex-row">
        <AuthSplitSection />
        <AuthSplitContent>{children}</AuthSplitContent>
      </MainSection>
    </LayoutSection>
  );
}
