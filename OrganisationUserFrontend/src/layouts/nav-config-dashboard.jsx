import {
  Users,
  Monitor,
  Palette,
  BookOpen,
  Building,
  FileText,
  UserPlus,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

const ICONS = {
  dashboard: <LayoutDashboard />,
  questionBank: <BookOpen />,
  papers: <FileText />,
  tests: <Monitor />,
  classes: <Users />,
  homework: <ClipboardList />,
  analytics: <BarChart3 />,
  company: <Building />,
  brand: <Palette />,
  members: <UserPlus />,
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
    subheader: 'Management',
    items: [
      {
        title: 'Question Bank',
        path: paths.dashboard.questionBank,
        icon: ICONS.questionBank,
        badge: 'Soon',
      },
      {
        title: 'Papers',
        path: paths.dashboard.papers.root,
        icon: ICONS.papers,
        children: [
          { title: 'All Papers', path: paths.dashboard.papers.root },
          { title: 'Create Paper', path: paths.dashboard.papers.create },
          { title: 'Auto-Generate', path: paths.dashboard.papers.autoGenerate },
          { title: 'Templates', path: paths.dashboard.papers.templates },
          { title: 'Blueprints', path: paths.dashboard.papers.blueprints },
          { title: 'Paper Sets', path: paths.dashboard.papers.sets },
        ],
      },
      {
        title: 'Online Tests',
        path: paths.dashboard.onlineTests.root,
        icon: ICONS.tests,
        children: [
          { title: 'All Tests', path: paths.dashboard.onlineTests.root },
          { title: 'Create Test', path: paths.dashboard.onlineTests.create },
        ],
      },
      {
        title: 'Classes & Students',
        path: paths.dashboard.classes,
        icon: ICONS.classes,
        badge: 'Soon',
      },
      {
        title: 'Homework',
        path: paths.dashboard.homework,
        icon: ICONS.homework,
        badge: 'Soon',
      },
    ],
  },
  {
    subheader: 'Insights',
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
      { title: 'Company Profile', path: paths.dashboard.settings.company, icon: ICONS.company },
      { title: 'Branding', path: paths.dashboard.settings.brand, icon: ICONS.brand },
      { title: 'Team Members', path: paths.dashboard.settings.members, icon: ICONS.members },
    ],
  },
];
