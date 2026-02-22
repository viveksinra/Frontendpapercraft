'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, BookOpen, User } from 'lucide-react';

const actions = [
  {
    label: 'My Tests',
    href: '/student/my-tests',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    label: 'Results',
    href: '/student/my-results',
    icon: BarChart3,
    color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
  },
  {
    label: 'Performance',
    href: '/student/performance',
    icon: BookOpen,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
  },
  {
    label: 'Profile',
    href: '/student/profile',
    icon: User,
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
              >
                <div className={`rounded-lg p-2.5 ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
