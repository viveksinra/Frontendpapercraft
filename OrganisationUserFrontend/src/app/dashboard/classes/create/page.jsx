'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { createClass } from 'src/lib/class-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// ----------------------------------------------------------------------

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CreateClassPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    yearGroup: '',
    subject: '',
    scheduleDays: [],
    scheduleTime: '',
    scheduleLocation: '',
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDay(day) {
    setForm((prev) => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter((d) => d !== day)
        : [...prev.scheduleDays, day],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Class name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await createClass(activeCompanyId, {
        name: form.name.trim(),
        description: form.description.trim(),
        yearGroup: form.yearGroup.trim(),
        subject: form.subject.trim(),
        schedule: {
          dayOfWeek: form.scheduleDays,
          time: form.scheduleTime.trim(),
          location: form.scheduleLocation.trim(),
        },
      });
      router.push(paths.dashboard.classes.root);
    } catch (err) {
      setError(err.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Class</h1>
            <p className="text-sm text-muted-foreground">Set up a new class for your organisation.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Year 5 Maths"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yearGroup">Year Group</Label>
            <Input
              id="yearGroup"
              placeholder="e.g. Year 5"
              value={form.yearGroup}
              onChange={(e) => updateField('yearGroup', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this class..."
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-3">
            <Label>Schedule</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={form.scheduleDays.includes(day) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  placeholder="e.g. 10:00 AM - 11:00 AM"
                  value={form.scheduleTime}
                  onChange={(e) => updateField('scheduleTime', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Room 101"
                  value={form.scheduleLocation}
                  onChange={(e) => updateField('scheduleLocation', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Class
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
