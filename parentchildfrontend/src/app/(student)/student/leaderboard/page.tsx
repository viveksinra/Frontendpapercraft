'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLeaderboard } from '@/lib/gamification-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, Trophy, Medal } from 'lucide-react';

const PERIODS = [
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'alltime', label: 'All Time' },
];

export default function StudentLeaderboardPage() {
  const { user } = useAuth();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    if (!companyId) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard(companyId, { period });
        setEntries(data.leaderboard || data.entries || data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId, period]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumColors = [
    'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
    'bg-gray-300/10 border-gray-400/30 text-gray-500',
    'bg-orange-400/10 border-orange-400/30 text-orange-500',
  ];
  const podiumLabels = ['1st', '2nd', '3rd'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-1 text-muted-foreground">See how you rank among your peers.</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No leaderboard data yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Podium - Top 3 */}
          {top3.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Reorder for visual podium: 2nd, 1st, 3rd */}
              {[top3[1], top3[0], top3[2]].map((entry: any, visualIdx: number) => {
                if (!entry) return <div key={visualIdx} />;
                const actualRank = entry === top3[0] ? 0 : entry === top3[1] ? 1 : 2;
                const isCurrentUser = entry.userId === user?.id;
                return (
                  <Card
                    key={entry.userId || actualRank}
                    className={`border-2 ${podiumColors[actualRank]} ${
                      isCurrentUser ? 'ring-2 ring-primary' : ''
                    } ${actualRank === 0 ? 'sm:-mt-4' : ''}`}
                  >
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="mb-2 text-2xl font-bold">{podiumLabels[actualRank]}</div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {(entry.name || entry.firstName || '?').charAt(0).toUpperCase()}
                      </div>
                      <p className="mt-2 font-semibold">
                        {entry.name || `${entry.firstName || ''} ${entry.lastName || ''}`.trim()}
                      </p>
                      <p className="mt-1 text-lg font-bold">{(entry.points || 0).toLocaleString()} pts</p>
                      {isCurrentUser && (
                        <Badge variant="default" className="mt-2">You</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Ranked Table */}
          {rest.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {rest.map((entry: any, idx: number) => {
                    const rank = idx + 4;
                    const isCurrentUser = entry.userId === user?.id;
                    return (
                      <div
                        key={entry.userId || rank}
                        className={`flex items-center gap-4 rounded-lg px-4 py-3 ${
                          isCurrentUser ? 'bg-primary/5 font-semibold' : 'hover:bg-muted/50'
                        }`}
                      >
                        <span className="w-8 text-center text-sm font-medium text-muted-foreground">
                          #{rank}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {(entry.name || entry.firstName || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="flex-1 text-sm">
                          {entry.name || `${entry.firstName || ''} ${entry.lastName || ''}`.trim()}
                          {isCurrentUser && (
                            <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                          )}
                        </span>
                        <span className="text-sm font-medium">
                          {(entry.points || 0).toLocaleString()} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
