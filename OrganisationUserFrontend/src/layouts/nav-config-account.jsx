import { Home, User, Shield, Settings, FolderOpen, CreditCard } from 'lucide-react';

export const _account = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Profile',
    href: '#',
    icon: <User className="h-5 w-5" />,
  },
  {
    label: 'Projects',
    href: '#',
    icon: <FolderOpen className="h-5 w-5" />,
    info: '3',
  },
  {
    label: 'Subscription',
    href: '#',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    label: 'Security',
    href: '#',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: 'Account settings',
    href: '#',
    icon: <Settings className="h-5 w-5" />,
  },
];
