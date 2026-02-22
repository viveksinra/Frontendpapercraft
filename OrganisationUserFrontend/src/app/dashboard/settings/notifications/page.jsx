'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, Bell, Mail, Smartphone } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getPreferences, updatePreferences } from 'src/lib/notification-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// ----------------------------------------------------------------------

const NOTIFICATION_CATEGORIES = [
  {
    key: 'messages',
    label: 'Messages',
    description: 'New direct messages and conversation updates.',
  },
  {
    key: 'announcements',
    label: 'Announcements',
    description: 'Organisation-wide and class announcements.',
  },
  {
    key: 'homework',
    label: 'Homework',
    description: 'New assignments, submission reminders, and grading.',
  },
  {
    key: 'tests',
    label: 'Tests',
    description: 'Test scheduling, reminders, and result availability.',
  },
  {
    key: 'discussions',
    label: 'Discussions',
    description: 'Thread replies, mentions, and new posts.',
  },
  {
    key: 'gamification',
    label: 'Gamification',
    description: 'Points earned, badge unlocks, and streak milestones.',
  },
  {
    key: 'courses',
    label: 'Courses',
    description: 'New content, enrollment updates, and course progress.',
  },
  {
    key: 'system',
    label: 'System',
    description: 'Account, billing, and system-level notifications.',
  },
];

const CHANNELS = [
  { key: 'inApp', label: 'In-App', icon: Bell },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'push', label: 'Push', icon: Smartphone },
];

// ----------------------------------------------------------------------

export default function NotificationPreferencesPage() {
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // preferences: { [category]: { inApp: bool, email: bool, push: bool } }
  const [preferences, setPreferences] = useState(() => {
    const initial = {};
    NOTIFICATION_CATEGORIES.forEach((cat) => {
      initial[cat.key] = { inApp: true, email: true, push: false };
    });
    return initial;
  });

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPreferences(activeCompanyId);
        if (!cancelled && data) {
          const prefs = data?.preferences || data;
          // Merge server data with defaults
          setPreferences((prev) => {
            const merged = { ...prev };
            Object.keys(prefs).forEach((key) => {
              if (merged[key]) {
                merged[key] = { ...merged[key], ...prefs[key] };
              }
            });
            return merged;
          });
        }
      } catch (err) {
        if (!cancelled) {
          // Preferences may not exist yet; that is ok
          if (err.response?.status !== 404) {
            setError(err.message || 'Failed to load preferences');
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

  function handleToggle(category, channel) {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category]?.[channel],
      },
    }));
    setSuccess(false);
  }

  function handleToggleAll(channel) {
    const allEnabled = NOTIFICATION_CATEGORIES.every(
      (cat) => preferences[cat.key]?.[channel]
    );
    setPreferences((prev) => {
      const updated = { ...prev };
      NOTIFICATION_CATEGORIES.forEach((cat) => {
        updated[cat.key] = { ...updated[cat.key], [channel]: !allEnabled };
      });
      return updated;
    });
    setSuccess(false);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await updatePreferences(activeCompanyId, { preferences });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  // Clear success after delay
  useEffect(() => {
    if (!success) return;
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
            <h1 className="text-2xl font-bold tracking-tight">Notification Preferences</h1>
            <p className="text-sm text-muted-foreground">
              Choose how you want to receive notifications for each category.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            Notification preferences saved successfully!
          </div>
        )}

        {/* Preferences table */}
        <Card>
          <CardContent className="p-0">
            {/* Channel headers */}
            <div className="flex items-center border-b px-6 py-3">
              <div className="flex-1">
                <span className="text-sm font-semibold">Category</span>
              </div>
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div key={ch.key} className="w-24 text-center">
                    <button
                      onClick={() => handleToggleAll(ch.key)}
                      className="flex flex-col items-center gap-1 mx-auto text-muted-foreground hover:text-foreground transition-colors"
                      title={`Toggle all ${ch.label}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{ch.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Categories */}
            {NOTIFICATION_CATEGORIES.map((cat, index) => (
              <div key={cat.key}>
                {index > 0 && <Separator />}
                <div className="flex items-center px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  {CHANNELS.map((ch) => (
                    <div key={ch.key} className="w-24 flex justify-center">
                      <button
                        onClick={() => handleToggle(cat.key, ch.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[cat.key]?.[ch.key]
                            ? 'bg-primary'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={preferences[cat.key]?.[ch.key] || false}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[cat.key]?.[ch.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info */}
        <p className="text-xs text-muted-foreground">
          In-app notifications are shown within the dashboard. Email notifications are sent to your
          registered email address. Push notifications require a supported browser.
        </p>
      </div>
    </div>
  );
}
