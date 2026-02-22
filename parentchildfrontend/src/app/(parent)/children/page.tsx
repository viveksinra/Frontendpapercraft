'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getChildren } from '@/lib/parent-api';
import { LinkedChildCard } from '@/components/parent/LinkedChildCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, UserPlus, Users } from 'lucide-react';

export default function ChildrenListPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChildren();
      setChildren(data.children || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load children.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your linked children accounts.
          </p>
        </div>
        <Button asChild>
          <Link href="/link-child">
            <UserPlus className="mr-2 h-4 w-4" />
            Link Child
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchChildren}>
            Try Again
          </Button>
        </div>
      ) : children.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold">No Children Linked</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Link your child&apos;s student account to start monitoring their progress.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/link-child">
                <UserPlus className="mr-2 h-4 w-4" />
                Link a Child
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child: any, index: number) => (
            <LinkedChildCard
              key={child.student?.id || child.id || index}
              child={child}
              onUnlinked={fetchChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}
