import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';

const ICONS = {
  dashboard: <LayoutDashboard />,
  analytics: <BarChart3 />,
  settings: <Settings />,
};

export const navData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        info: `v${CONFIG.appVersion}`,
      },
    ],
  },
  {
    subheader: 'Analytics',
    items: [
      {
        title: 'Analytics',
        path: paths.dashboard.analytics,
        icon: ICONS.analytics,
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      {
        title: 'Settings',
        path: paths.dashboard.settings.root,
        icon: ICONS.settings,
        children: [
          { title: 'Company Profile', path: paths.dashboard.settings.company },
          { title: 'Branding', path: paths.dashboard.settings.brand },
          { title: 'Team Members', path: paths.dashboard.settings.members },
        ],
      },
    ],
  },
];
