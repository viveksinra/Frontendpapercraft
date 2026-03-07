'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Save,
  Star,
  Award,
  Flame,
  Trophy,
  Trash2,
  Loader2,
} from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  addBadge,
  getConfig,
  deleteBadge,
  updateConfig,
} from 'src/lib/gamification-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

// ----------------------------------------------------------------------

const DEFAULT_POINT_RULES = [
  { action: 'test_completed', label: 'Test Completed', points: 10 },
  { action: 'homework_submitted', label: 'Homework Submitted', points: 5 },
  { action: 'perfect_score', label: 'Perfect Score', points: 25 },
  { action: 'discussion_post', label: 'Discussion Post', points: 3 },
  { action: 'discussion_reply', label: 'Discussion Reply', points: 2 },
  { action: 'daily_login', label: 'Daily Login', points: 1 },
  { action: 'course_completed', label: 'Course Completed', points: 50 },
];

// ----------------------------------------------------------------------

export default function GamificationConfigPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [pointRules, setPointRules] = useState(DEFAULT_POINT_RULES);
  const [badges, setBadges] = useState([]);
  const [streakSettings, setStreakSettings] = useState({
    enabled: true,
    milestones: [3, 7, 14, 30],
    bonusPerMilestone: 10,
  });
  const [leaderboardSettings, setLeaderboardSettings] = useState({
    enabled: true,
    resetPeriod: 'weekly',
    showTopN: 10,
  });

  // Badge dialog
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: '', description: '', criteria: '', icon: '' });
  const [addingBadge, setAddingBadge] = useState(false);

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getConfig(activeCompanyId);
        if (!cancelled && data) {
          if (data.pointRules) setPointRules(data.pointRules);
          if (data.badges) setBadges(data.badges);
          if (data.streakSettings) setStreakSettings(data.streakSettings);
          if (data.leaderboardSettings) setLeaderboardSettings(data.leaderboardSettings);
        }
      } catch (err) {
        if (!cancelled) {
          // Config may not exist yet; that is ok
          if (err.response?.status !== 404) {
            setError(err.message || 'Failed to load gamification config');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  function handlePointChange(index, value) {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return;
    setPointRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, points: num } : rule))
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await updateConfig(activeCompanyId, {
        pointRules,
        streakSettings,
        leaderboardSettings,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddBadge() {
    if (!newBadge.name.trim()) return;
    try {
      setAddingBadge(true);
      const result = await addBadge(activeCompanyId, newBadge);
      setBadges((prev) => [...prev, result?.badge || result]);
      setBadgeDialogOpen(false);
      setNewBadge({ name: '', description: '', criteria: '', icon: '' });
    } catch (err) {
      setError(err.message || 'Failed to add badge');
    } finally {
      setAddingBadge(false);
    }
  }

  async function handleDeleteBadge(badgeId) {
    if (!confirm('Delete this badge?')) return;
    try {
      await deleteBadge(activeCompanyId, badgeId);
      setBadges((prev) => prev.filter((b) => (b._id || b.id) !== badgeId));
    } catch (err) {
      setError(err.message || 'Failed to delete badge');
    }
  }

  // Clear success after delay
  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Gamification</h1>
            <p className="text-sm text-muted-foreground">
              Configure points, badges, streaks, and leaderboard settings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(paths.dashboard.gamification.leaderboard)}
            >
              <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Config'}
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            Configuration saved successfully!
          </div>
        )}

        {/* Point Rules */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Point Rules</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configure how many points students earn for each action.
            </p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead className="w-[120px]">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pointRules.map((rule, index) => (
                    <TableRow key={rule.action}>
                      <TableCell className="font-medium">{rule.label}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={rule.points}
                          onChange={(e) => handlePointChange(index, e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Badge Definitions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Badge Definitions</h2>
              </div>
              <Button size="sm" onClick={() => setBadgeDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Badge
              </Button>
            </div>
            {badges.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No badges defined yet. Add one to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => {
                  const badgeId = badge._id || badge.id;
                  return (
                    <div
                      key={badgeId}
                      className="flex items-start justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-semibold">{badge.name}</span>
                        </div>
                        {badge.description && (
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        )}
                        {badge.criteria && (
                          <Badge variant="outline" className="w-fit text-[10px]">
                            {badge.criteria}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBadge(badgeId)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Streak Settings</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={streakSettings.enabled}
                  onChange={(e) =>
                    setStreakSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">Enable daily login streaks</span>
              </label>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Milestones (days, comma-separated)
                </label>
                <Input
                  value={streakSettings.milestones?.join(', ') || ''}
                  onChange={(e) =>
                    setStreakSettings((prev) => ({
                      ...prev,
                      milestones: e.target.value
                        .split(',')
                        .map((s) => parseInt(s.trim(), 10))
                        .filter((n) => !Number.isNaN(n)),
                    }))
                  }
                  placeholder="3, 7, 14, 30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Bonus points per milestone
                </label>
                <Input
                  type="number"
                  min="0"
                  value={streakSettings.bonusPerMilestone || 0}
                  onChange={(e) =>
                    setStreakSettings((prev) => ({
                      ...prev,
                      bonusPerMilestone: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Leaderboard Settings</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={leaderboardSettings.enabled}
                  onChange={(e) =>
                    setLeaderboardSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">Enable leaderboard</span>
              </label>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Reset period</label>
                <select
                  value={leaderboardSettings.resetPeriod || 'weekly'}
                  onChange={(e) =>
                    setLeaderboardSettings((prev) => ({ ...prev, resetPeriod: e.target.value }))
                  }
                  className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never (all-time)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Show top N students</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={leaderboardSettings.showTopN || 10}
                  onChange={(e) =>
                    setLeaderboardSettings((prev) => ({
                      ...prev,
                      showTopN: parseInt(e.target.value, 10) || 10,
                    }))
                  }
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Badge Dialog */}
      <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Badge</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={newBadge.name}
                onChange={(e) => setNewBadge((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Quiz Master"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newBadge.description}
                onChange={(e) => setNewBadge((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. Complete 10 quizzes with 90%+ score"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Criteria</label>
              <Input
                value={newBadge.criteria}
                onChange={(e) => setNewBadge((prev) => ({ ...prev, criteria: e.target.value }))}
                placeholder="e.g. tests_completed >= 10 && avg_score >= 90"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Icon (emoji or name)</label>
              <Input
                value={newBadge.icon}
                onChange={(e) => setNewBadge((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g. trophy, star"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBadgeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBadge} disabled={addingBadge || !newBadge.name.trim()}>
              {addingBadge ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {addingBadge ? 'Adding...' : 'Add Badge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
