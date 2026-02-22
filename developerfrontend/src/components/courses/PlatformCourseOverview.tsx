'use client';

import { BookOpen, Users, TrendingUp, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlatformCourseOverviewProps {
  data: any;
}

const cards = [
  { key: 'totalCourses', label: 'Total Courses', desc: 'Across all institutes', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'publishedCourses', label: 'Published', desc: 'Live courses', icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  { key: 'totalEnrollments', label: 'Total Enrollments', desc: 'Active students', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'courseRevenue', label: 'Course Revenue', desc: 'From paid courses', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function PlatformCourseOverview({ data }: PlatformCourseOverviewProps) {
  const values: Record<string, string> = {
    totalCourses: (data.totalCourses || 0).toLocaleString(),
    publishedCourses: (data.publishedCourses || 0).toLocaleString(),
    totalEnrollments: (data.totalEnrollments || 0).toLocaleString(),
    courseRevenue: formatCurrency(data.courseRevenue || 0),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl">{values[card.key]}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
