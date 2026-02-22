'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboard } from '@/lib/parent-api';
import { ChildSelectorTabs } from '@/components/parent/ChildSelectorTabs';
import { ChildOverviewCard } from '@/components/parent/ChildOverviewCard';
import { ParentAlertsList } from '@/components/parent/ParentAlertsList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';

export default function ParentDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="mt-3 text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const children = dashboard?.children || [];
  const allAlerts = children.flatMap((c: any) => c.alerts || []);

  // Empty state: no children linked
  if (children.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your child&apos;s progress and test results.
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold">No Children Linked</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Link your child&apos;s student account to start monitoring their
              progress, test results, and performance.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/link-child">
                <UserPlus className="mr-2 h-4 w-4" />
                Link a Child
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChild = children[selectedIndex] || children[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your child&apos;s progress and test results.
        </p>
      </div>

      {/* Child selector tabs */}
      <ChildSelectorTabs
        children={children}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onLinkChild={() => router.push('/link-child')}
      />

      {/* Child overview */}
      <ChildOverviewCard child={selectedChild} />

      {/* Alerts section */}
      {allAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <ParentAlertsList alerts={allAlerts} />
        </div>
      )}
    </div>
  );
}
