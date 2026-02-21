'use client';

import { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';

import { useAuthContext } from 'src/auth/hooks';

import { Logo } from 'src/components/logo';

import { NavMobile } from './nav-mobile';
import { NavVertical } from './nav-vertical';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { WorkspacesPopover } from '../components/workspaces-popover';
import { AccountDropdown } from '../components/account-dropdown';
import { MainSection, HeaderSection, LayoutSection } from '../core';

export function DashboardLayout({ children, slotProps }) {
  const { user } = useAuthContext();

  const [navMini, setNavMini] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navData = slotProps?.nav?.data ?? dashboardNavData;

  const canDisplayItemByRole = useCallback(
    (allowedRoles) => !allowedRoles?.includes(user?.role),
    [user?.role]
  );

  const cssVars = {
    ...dashboardLayoutVars(),
    ...dashboardNavColorVars().layout,
    ...(navMini && { '--layout-nav-vertical-width': 'var(--layout-nav-mini-width)' }),
  };

  const headerSlots = {
    leftArea: (
      <>
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="mr-1 -ml-1 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <NavMobile
          data={navData}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          checkPermissions={canDisplayItemByRole}
        />

        {/* Workspace popover */}
        <WorkspacesPopover />
      </>
    ),
    rightArea: <AccountDropdown />,
  };

  return (
    <LayoutSection
      headerSection={<HeaderSection disableElevation slots={headerSlots} />}
      sidebarSection={
        <NavVertical
          data={navData}
          isNavMini={navMini}
          onToggleNav={() => setNavMini((prev) => !prev)}
          checkPermissions={canDisplayItemByRole}
        />
      }
      cssVars={cssVars}
    >
      <MainSection>{children}</MainSection>
    </LayoutSection>
  );
}
