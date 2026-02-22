'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getRegistrationStats, type RegistrationStats } from '@/lib/admin-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default function RegistrationStatsPage() {
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data: any = await getRegistrationStats();
      const result = data.stats || data.data || data;
      setStats(result as RegistrationStats);
    } catch (err: any) {
      if (err?.status === 404) {
        setStats(null);
      } else {
        toast.error(err?.message || 'Failed to load registration stats.');
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalRecentStudents = stats?.registrationsLast30Days?.reduce(
    (sum, day) => sum + day.students,
    0
  ) ?? 0;

  const totalRecentParents = stats?.registrationsLast30Days?.reduce(
    (sum, day) => sum + day.parents,
    0
  ) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registration Stats</h2>
          <p className="text-muted-foreground">
            Platform-wide registration statistics for students and parents.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && !stats && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading stats...</span>
        </div>
      )}

      {!loading && !stats && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No registration stats available. The endpoint may not be configured yet.
          </CardContent>
        </Card>
      )}

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Students</CardDescription>
                <CardTitle className="text-3xl">
                  {stats.totalStudents?.toLocaleString() ?? '\u2014'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  All registered students on the platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Parents</CardDescription>
                <CardTitle className="text-3xl">
                  {stats.totalParents?.toLocaleString() ?? '\u2014'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  All registered parents on the platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Students (Last 30 Days)</CardDescription>
                <CardTitle className="text-3xl">
                  {totalRecentStudents.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  New student registrations in the last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Parents (Last 30 Days)</CardDescription>
                <CardTitle className="text-3xl">
                  {totalRecentParents.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  New parent registrations in the last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Registrations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registrations (Last 30 Days)</CardTitle>
              <CardDescription>
                Daily breakdown of new student and parent registrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.registrationsLast30Days &&
                stats.registrationsLast30Days.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Parents</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.registrationsLast30Days.map((day) => (
                        <TableRow key={day.date}>
                          <TableCell className="font-medium">
                            {formatDate(day.date)}
                          </TableCell>
                          <TableCell>{day.students}</TableCell>
                          <TableCell>{day.parents}</TableCell>
                          <TableCell className="font-medium">
                            {day.students + day.parents}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No registration data available for the last 30 days.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
