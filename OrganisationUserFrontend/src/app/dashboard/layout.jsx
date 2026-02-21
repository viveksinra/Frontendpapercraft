'use client';

import { CONFIG } from 'src/global-config';
import { DashboardLayout as DashboardShell } from 'src/layouts/dashboard';
import { navData as dashboardNavData } from 'src/layouts/nav-config-dashboard';

import { AuthGuard, CompanyGuard } from 'src/auth/guard';
import { BootstrapStatusProvider } from 'src/contexts/bootstrap-status-context';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const renderWithLaunchpad = (node) => (
    <BootstrapStatusProvider>
      <LayoutWithNav>{node}</LayoutWithNav>
    </BootstrapStatusProvider>
  );

  if (CONFIG.auth.skip) {
    return (
      <CompanyGuard>
        {renderWithLaunchpad(children)}
      </CompanyGuard>
    );
  }

  return (
    <AuthGuard>
      <CompanyGuard>
        {renderWithLaunchpad(children)}
      </CompanyGuard>
    </AuthGuard>
  );
}

function LayoutWithNav({ children }) {
  // All nav items are now always enabled for development.
  // The Launchpad checklist gating is removed since this is not a live app.
  return (
    <DashboardShell slotProps={{ nav: { data: dashboardNavData } }}>
      {children}
    </DashboardShell>
  );
}

