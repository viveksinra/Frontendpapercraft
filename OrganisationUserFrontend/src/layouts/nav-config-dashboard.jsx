import {
  Bell,
  Users,
  Trophy,
  Monitor,
  Palette,
  Receipt,
  BookOpen,
  Building,
  FileText,
  UserPlus,
  BarChart3,
  Megaphone,
  TrendingUp,
  CreditCard,
  PlayCircle,
  ShoppingBag,
  FileBarChart,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  MessageCircle,
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
  students: <GraduationCap />,
  announcements: <Megaphone />,
  fees: <Receipt />,
  courses: <PlayCircle />,
  products: <ShoppingBag />,
  revenue: <TrendingUp />,
  stripe: <CreditCard />,
  reports: <FileBarChart />,
  messages: <MessageSquare />,
  discussions: <MessageCircle />,
  gamification: <Trophy />,
  notifications: <Bell />,
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
        path: paths.dashboard.questionBank.root,
        icon: ICONS.questionBank,
        children: [
          { title: 'All Questions', path: paths.dashboard.questionBank.root },
          { title: 'Create Question', path: paths.dashboard.questionBank.create },
          { title: 'Bulk Import', path: paths.dashboard.questionBank.import },
          { title: 'Subjects & Topics', path: paths.dashboard.questionBank.subjects },
        ],
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
        title: 'Students',
        path: paths.dashboard.students.root,
        icon: ICONS.students,
      },
      {
        title: 'Classes',
        path: paths.dashboard.classes.root,
        icon: ICONS.classes,
        children: [
          { title: 'All Classes', path: paths.dashboard.classes.root },
          { title: 'Create Class', path: paths.dashboard.classes.create },
        ],
      },
      {
        title: 'Homework',
        path: paths.dashboard.homework.root,
        icon: ICONS.homework,
        children: [
          { title: 'All Homework', path: paths.dashboard.homework.root },
          { title: 'Create Homework', path: paths.dashboard.homework.create },
        ],
      },
      {
        title: 'Announcements',
        path: paths.dashboard.announcements.root,
        icon: ICONS.announcements,
        children: [
          { title: 'All Announcements', path: paths.dashboard.announcements.root },
          { title: 'Create Announcement', path: paths.dashboard.announcements.create },
        ],
      },
      {
        title: 'Fees',
        path: paths.dashboard.fees.root,
        icon: ICONS.fees,
      },
      {
        title: 'Courses',
        path: paths.dashboard.courses.root,
        icon: ICONS.courses,
        children: [
          { title: 'All Courses', path: paths.dashboard.courses.root },
          { title: 'Create Course', path: paths.dashboard.courses.create },
        ],
      },
      {
        title: 'Products & Pricing',
        path: paths.dashboard.products.root,
        icon: ICONS.products,
        children: [
          { title: 'All Products', path: paths.dashboard.products.root },
          { title: 'Create Product', path: paths.dashboard.products.create },
        ],
      },
      {
        title: 'Messages',
        path: paths.dashboard.messages.root,
        icon: ICONS.messages,
      },
      {
        title: 'Discussions',
        path: paths.dashboard.discussions.root,
        icon: ICONS.discussions,
      },
    ],
  },
  {
    subheader: 'Insights',
    items: [
      {
        title: 'Analytics',
        path: paths.dashboard.analytics.root,
        icon: ICONS.analytics,
        children: [
          { title: 'Dashboard', path: paths.dashboard.analytics.root },
          { title: 'Students', path: paths.dashboard.analytics.students.root },
          { title: 'Classes', path: paths.dashboard.analytics.classes.root },
          { title: 'Institute', path: paths.dashboard.analytics.institute },
          { title: 'Questions', path: paths.dashboard.analytics.questions.root },
        ],
      },
      {
        title: 'Reports',
        path: paths.dashboard.reports.root,
        icon: ICONS.reports,
        children: [
          { title: 'All Reports', path: paths.dashboard.reports.root },
          { title: 'Generate Report', path: paths.dashboard.reports.generate },
        ],
      },
      {
        title: 'Revenue Dashboard',
        path: paths.dashboard.revenue.root,
        icon: ICONS.revenue,
      },
      {
        title: 'Gamification',
        path: paths.dashboard.gamification.root,
        icon: ICONS.gamification,
        children: [
          { title: 'Configuration', path: paths.dashboard.gamification.root },
          { title: 'Leaderboard', path: paths.dashboard.gamification.leaderboard },
        ],
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      { title: 'Company Profile', path: paths.dashboard.settings.company, icon: ICONS.company },
      { title: 'Branding', path: paths.dashboard.settings.brand, icon: ICONS.brand },
      { title: 'Team Members', path: paths.dashboard.settings.members, icon: ICONS.members },
      { title: 'Stripe Connect', path: paths.dashboard.settings.stripe, icon: ICONS.stripe },
      { title: 'Notifications', path: paths.dashboard.settings.notifications, icon: ICONS.notifications },
    ],
  },
];
