'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getChildren } from '@/lib/parent-api';
import { getStudentGamificationProfile, getBadges } from '@/lib/gamification-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  AlertCircle,
  Trophy,
  Star,
  Flame,
  Award,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function ParentAchievementsPage() {
  const { user } = useAuth();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load children list
  useEffect(() => {
    async function loadChildren() {
      setLoadingChildren(true);
      setError(null);
      try {
        const data = await getChildren();
        const list = data.children || data || [];
        setChildren(list);
        if (list.length > 0) {
          const firstId = list[0].student?.userId || list[0].student?.id || list[0].id || list[0].userId;
          setSelectedChildId(firstId);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load children.');
      } finally {
        setLoadingChildren(false);
      }
    }
    loadChildren();
  }, []);

  // Load selected child's gamification profile
  useEffect(() => {
    if (!companyId || !selectedChildId) return;
    async function loadProfile() {
      setLoadingProfile(true);
      setError(null);
      try {
        const [profileData, badgesData] = await Promise.all([
          getStudentGamificationProfile(companyId, selectedChildId),
          getBadges(companyId),
        ]);
        setProfile(profileData.profile || profileData);
        setBadges(badgesData.badges || badgesData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load achievements.');
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [companyId, selectedChildId]);

  function getChildName(child: any) {
    const s = child.student || child;
    return s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Child';
  }

  function getChildId(child: any) {
    return child.student?.userId || child.student?.id || child.id || child.userId;
  }

  if (loadingChildren) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-10 w-10 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          No children linked to your account yet.
        </p>
      </div>
    );
  }

  const level = profile?.level || 1;
  const totalPoints = profile?.totalPoints || 0;
  const xpCurrent = profile?.xpCurrent || 0;
  const xpRequired = profile?.xpRequired || 100;
  const progressPercent = xpRequired > 0 ? Math.min((xpCurrent / xpRequired) * 100, 100) : 0;
  const currentStreak = profile?.streak?.currentStreak || profile?.currentStreak || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Child Achievements</h1>
          <p className="mt-1 text-muted-foreground">
            View your child&apos;s gamification progress and badges.
          </p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child: any) => (
              <SelectItem key={getChildId(child)} value={getChildId(child)}>
                {getChildName(child)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loadingProfile ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
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

          {/* Level Progress */}
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

          {/* Badges */}
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
                  No badges earned yet.
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
        </>
      )}
    </div>
  );
}
