'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Flame,
  Target,
  ArrowRight,
} from 'lucide-react';
import { ChildRecentResults } from './ChildRecentResults';
import { ChildUpcomingTests } from './ChildUpcomingTests';

interface ChildOverviewCardProps {
  child: any;
}

export function ChildOverviewCard({ child }: ChildOverviewCardProps) {
  const student = child.student || child;
  const childId = student.id || student.userId;
  const name = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Child';
  const stats = child.stats || {};
  const recentResults = child.recentResults || [];
  const upcomingTests = child.upcomingTests || [];

  const average = stats.averageScore ?? stats.average;
  const streak = stats.streak ?? stats.currentStreak ?? 0;
  const totalTests = stats.totalTests ?? stats.testsCompleted ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {average !== undefined && average !== null
                ? `${Math.round(average)}%`
                : '--'}
            </div>
            <CardDescription className="mt-1">Across all tests</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '--'}
            </div>
            <CardDescription className="mt-1">Current streak</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <CardDescription className="mt-1">Tests completed</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Results</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/children/${childId}/results`}>
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChildRecentResults
              results={recentResults.slice(0, 3)}
              childId={childId}
            />
          </CardContent>
        </Card>

        {/* Upcoming tests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Tests</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/children/${childId}/tests`}>
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChildUpcomingTests tests={upcomingTests.slice(0, 2)} />
          </CardContent>
        </Card>
      </div>

      {/* Action links */}
      <Separator />
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/children/${childId}/tests`}>
            <FileText className="mr-2 h-4 w-4" />
            View Tests
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/children/${childId}/results`}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Results
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/children/${childId}/performance`}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </Link>
        </Button>
      </div>
    </div>
  );
}
