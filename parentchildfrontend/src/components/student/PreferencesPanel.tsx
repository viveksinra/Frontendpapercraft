'use client';

import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/student-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';

interface Preferences {
  showTimerWarning: boolean;
  questionFontSize: 'small' | 'medium' | 'large';
  highContrastMode: boolean;
}

export function PreferencesPanel() {
  const [prefs, setPrefs] = useState<Preferences>({
    showTimerWarning: true,
    questionFontSize: 'medium',
    highContrastMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getProfile();
        if (profile.preferences) {
          setPrefs({
            showTimerWarning: profile.preferences.showTimerWarning ?? true,
            questionFontSize: profile.preferences.questionFontSize ?? 'medium',
            highContrastMode: profile.preferences.highContrastMode ?? false,
          });
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ preferences: prefs });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof Preferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Test Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Timer warning toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Timer Warning</Label>
            <p className="text-xs text-muted-foreground">Show warning when time is running low</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.showTimerWarning}
            onClick={() => toggle('showTimerWarning')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.showTimerWarning ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.showTimerWarning ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* High contrast toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">High Contrast Mode</Label>
            <p className="text-xs text-muted-foreground">Use higher contrast colors for better readability</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.highContrastMode}
            onClick={() => toggle('highContrastMode')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.highContrastMode ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.highContrastMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Font size select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Question Font Size</Label>
          <Select
            value={prefs.questionFontSize}
            onValueChange={(val) =>
              setPrefs((prev) => ({ ...prev, questionFontSize: val as Preferences['questionFontSize'] }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
