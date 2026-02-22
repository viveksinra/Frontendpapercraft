'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getGamificationProfile,
  getPointsHistory,
  getBadges,
  getStreak,
} from '@/lib/gamification-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  Trophy,
  Flame,
  Star,
  Award,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function StudentGamificationPage() {
  const { user } = useAuth();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [profileData, badgesData, streakData, historyData] = await Promise.all([
          getGamificationProfile(companyId),
          getBadges(companyId),
          getStreak(companyId),
          getPointsHistory(companyId, { pageSize: 10 }),
        ]);
        setProfile(profileData.profile || profileData);
        setBadges(badgesData.badges || badgesData || []);
        setStreak(streakData.streak || streakData);
        setPointsHistory(historyData.history || historyData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load gamification data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const level = profile?.level || 1;
  const totalPoints = profile?.totalPoints || 0;
  const xpCurrent = profile?.xpCurrent || 0;
  const xpRequired = profile?.xpRequired || 100;
  const progressPercent = xpRequired > 0 ? Math.min((xpCurrent / xpRequired) * 100, 100) : 0;
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;
  const streakDays = streak?.recentDays || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Progress</h1>
        <p className="mt-1 text-muted-foreground">Track your achievements and progress.</p>
      </div>

      {/* Level & Points */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {xpCurrent} / {xpRequired} XP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-5 w-5 text-orange-500" />
            Activity Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current streak</p>
              <p className="text-xl font-bold">{currentStreak} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest streak</p>
              <p className="text-xl font-bold">{longestStreak} days</p>
            </div>
          </div>
          {streakDays.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {streakDays.map((day: any, idx: number) => (
                <div
                  key={idx}
                  className={`h-8 w-8 rounded-sm text-xs flex items-center justify-center ${
                    day.active
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  title={day.date}
                >
                  {day.label || new Date(day.date).getDate()}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badge Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-5 w-5" />
            Badges ({badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No badges earned yet. Keep going!
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {badges.map((badge: any) => (
                <div
                  key={badge.id || badge._id || badge.badgeId}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center ${
                    badge.earned ? '' : 'opacity-40'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                    {badge.icon || <Trophy className="h-6 w-6 text-primary" />}
                  </div>
                  <span className="text-xs font-medium">{badge.name}</span>
                  {badge.earned && (
                    <Badge variant="default" className="text-[10px]">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Points History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-5 w-5" />
            Recent Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pointsHistory.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No points history yet.</p>
          ) : (
            <div className="space-y-2">
              {pointsHistory.map((entry: any, idx: number) => (
                <div
                  key={entry.id || entry._id || idx}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{entry.reason || entry.action || 'Points earned'}</p>
                    {entry.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-green-600">+{entry.points || 0}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
