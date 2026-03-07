'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Medal, Trophy, Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getLeaderboard } from 'src/lib/gamification-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

const PERIOD_OPTIONS = [
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' },
  { label: 'All Time', value: 'all_time' },
];

const PODIUM_COLORS = [
  'bg-amber-100 border-amber-300 text-amber-800',    // 1st
  'bg-gray-100 border-gray-300 text-gray-700',       // 2nd
  'bg-orange-100 border-orange-300 text-orange-700',  // 3rd
];

const PODIUM_ICONS = ['text-amber-500', 'text-gray-400', 'text-orange-400'];

// ----------------------------------------------------------------------

export default function LeaderboardPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState('weekly');

  const loadLeaderboard = useCallback(async () => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getLeaderboard(activeCompanyId, { period });
      setEntries(data?.leaderboard || data?.entries || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, period]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(paths.dashboard.gamification.root)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">
                Top performing students ranked by points.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Period Filter */}
        <div className="flex items-center gap-1 border-b">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                period === opt.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No leaderboard data yet for this period.
            </p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {topThree.length > 0 && (
              <div className="flex items-end justify-center gap-4 pt-4 pb-6">
                {/* 2nd place */}
                {topThree.length > 1 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${PODIUM_COLORS[1]}`}>
                      <Medal className={`h-6 w-6 ${PODIUM_ICONS[1]}`} />
                    </div>
                    <span className="text-sm font-semibold text-center max-w-[100px] truncate">
                      {topThree[1].displayName || topThree[1].email || 'Student'}
                    </span>
                    <Badge variant="secondary">{topThree[1].points || 0} pts</Badge>
                    <div className="h-16 w-20 rounded-t-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-500">
                      2
                    </div>
                  </div>
                )}

                {/* 1st place */}
                {topThree.length > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${PODIUM_COLORS[0]}`}>
                      <Trophy className={`h-8 w-8 ${PODIUM_ICONS[0]}`} />
                    </div>
                    <span className="text-sm font-bold text-center max-w-[100px] truncate">
                      {topThree[0].displayName || topThree[0].email || 'Student'}
                    </span>
                    <Badge variant="default">{topThree[0].points || 0} pts</Badge>
                    <div className="h-24 w-20 rounded-t-lg bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xl font-bold text-amber-700 dark:text-amber-200">
                      1
                    </div>
                  </div>
                )}

                {/* 3rd place */}
                {topThree.length > 2 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${PODIUM_COLORS[2]}`}>
                      <Medal className={`h-5 w-5 ${PODIUM_ICONS[2]}`} />
                    </div>
                    <span className="text-sm font-semibold text-center max-w-[100px] truncate">
                      {topThree[2].displayName || topThree[2].email || 'Student'}
                    </span>
                    <Badge variant="outline">{topThree[2].points || 0} pts</Badge>
                    <div className="h-12 w-20 rounded-t-lg bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-lg font-bold text-orange-600 dark:text-orange-200">
                      3
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of the leaderboard */}
            {rest.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="w-[100px] text-right">Points</TableHead>
                      <TableHead className="w-[100px] text-right">Streak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rest.map((entry, index) => {
                      const rank = index + 4;
                      const entryId = entry._id || entry.id || entry.userId || index;
                      return (
                        <TableRow key={entryId}>
                          <TableCell className="font-medium text-muted-foreground">
                            #{rank}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {entry.displayName || entry.email || 'Student'}
                              </span>
                              {entry.email && entry.displayName && (
                                <span className="text-xs text-muted-foreground">{entry.email}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium">
                            {entry.points || 0}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {entry.currentStreak || 0}d
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
