'use client';

import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/student-api';
import { useAuth } from '@/contexts/AuthContext';
import { WelcomeCard } from './WelcomeCard';
import { UpcomingTestsList } from './UpcomingTestsList';
import { RecentResultsList } from './RecentResultsList';
import { QuickActions } from './QuickActions';
import { StatsBar } from './StatsBar';

interface DashboardData {
  upcomingTests: any[];
  recentResults: any[];
  pendingHomework: any[];
  stats: {
    testsTaken: number;
    averageScore: number | null;
    streak: number;
    orgName?: string;
  };
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const firstName = user?.firstName || 'Student';
  const rawStats = data?.stats;
  const stats = {
    testsTaken: rawStats?.testsTaken ?? 0,
    averageScore: rawStats?.averageScore ?? null,
    streak: rawStats?.streak ?? 0,
    orgName: rawStats?.orgName,
  };

  return (
    <div className="space-y-6">
      <WelcomeCard
        name={firstName}
        orgName={stats.orgName}
        streak={stats.streak}
      />

      <StatsBar
        testsTaken={stats.testsTaken}
        averageScore={stats.averageScore}
        streak={stats.streak}
      />

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingTestsList tests={data?.upcomingTests || []} />
        <RecentResultsList results={data?.recentResults || []} />
      </div>
    </div>
  );
}
