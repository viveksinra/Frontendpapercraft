'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, MessageCircle, Trophy, Medal, Star, TrendingUp, Users, BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  getEngagementOverview,
  getOrgEngagementMetrics,
  type EngagementOverview,
  type OrgEngagementMetrics,
} from '@/lib/engagement-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function EngagementPage() {
  const [overview, setOverview] = useState<EngagementOverview | null>(null);
  const [orgMetrics, setOrgMetrics] = useState<OrgEngagementMetrics[]>([]);
  const [orgTotal, setOrgTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewResult, metricsResult] = await Promise.all([
        getEngagementOverview(),
        getOrgEngagementMetrics(),
      ]);
      const overviewData: any = overviewResult;
      setOverview(overviewData.data || overviewData);
      const metricsData: any = metricsResult;
      const resolved = metricsData.data || metricsData;
      setOrgMetrics(resolved.orgs || []);
      setOrgTotal(resolved.total || 0);
    } catch (err: any) {
      if (err?.status === 404) {
        setOverview(null);
        setOrgMetrics([]);
      } else {
        toast.error(err?.message || 'Failed to load engagement analytics.');
        setOverview(null);
        setOrgMetrics([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const metricCards = overview
    ? [
        {
          label: 'Total Messages',
          value: overview.totalMessages?.toLocaleString() ?? '\u2014',
          description: 'Messages sent across all organisations',
          icon: MessageSquare,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          accent: 'border-l-blue-500',
        },
        {
          label: 'Discussion Threads',
          value: overview.totalDiscussionThreads?.toLocaleString() ?? '\u2014',
          description: 'Total discussion threads created',
          icon: MessageCircle,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10',
          accent: 'border-l-indigo-500',
        },
        {
          label: 'Gamified Students',
          value: overview.totalGamifiedStudents?.toLocaleString() ?? '\u2014',
          description: 'Students with gamification profiles',
          icon: Users,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          accent: 'border-l-green-500',
        },
        {
          label: 'Points Awarded',
          value: overview.totalPointsAwarded?.toLocaleString() ?? '\u2014',
          description: 'Total XP points awarded platform-wide',
          icon: Star,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          accent: 'border-l-amber-500',
        },
        {
          label: 'Badges Earned',
          value: overview.totalBadgesEarned?.toLocaleString() ?? '\u2014',
          description: 'Total badges earned by students',
          icon: Medal,
          color: 'text-purple-500',
          bg: 'bg-purple-500/10',
          accent: 'border-l-purple-500',
        },
        {
          label: 'Average Streak',
          value: overview.averageStreak != null ? overview.averageStreak.toFixed(1) : '\u2014',
          description: 'Average student streak across the platform',
          icon: TrendingUp,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10',
          accent: 'border-l-rose-500',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Engagement Analytics</h2>
          <p className="text-muted-foreground">
            Platform-wide messaging, discussions, and gamification metrics.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && !overview && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading engagement data...</span>
        </div>
      )}

      {!loading && !overview && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No engagement data available. The endpoint may not be configured yet.
          </CardContent>
        </Card>
      )}

      {overview && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className={`border-l-4 ${card.accent}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription>{card.label}</CardDescription>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-3xl">{card.value}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Org Engagement Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                Organisation Engagement
              </CardTitle>
              <CardDescription>
                Engagement metrics broken down by organisation.
                {orgTotal > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {orgTotal} {orgTotal === 1 ? 'org' : 'orgs'}
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orgMetrics.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Org Name</TableHead>
                        <TableHead>Messages</TableHead>
                        <TableHead>Discussions</TableHead>
                        <TableHead>Gamified Students</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Badges</TableHead>
                        <TableHead>Avg Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgMetrics.map((org) => (
                        <TableRow key={org.orgId}>
                          <TableCell className="font-medium">{org.orgName}</TableCell>
                          <TableCell>{org.messages.toLocaleString()}</TableCell>
                          <TableCell>{org.discussions.toLocaleString()}</TableCell>
                          <TableCell>{org.gamifiedStudents.toLocaleString()}</TableCell>
                          <TableCell>{org.pointsAwarded.toLocaleString()}</TableCell>
                          <TableCell>{org.badgesEarned.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{org.averageLevel.toFixed(1)}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No organisation engagement data available.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
