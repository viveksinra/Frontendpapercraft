'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { listClasses } from 'src/lib/class-api';
import { createAnnouncement } from 'src/lib/announcement-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// ----------------------------------------------------------------------

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: 'organization',
    classId: '',
    expiresAt: '',
  });

  useEffect(() => {
    if (!activeCompanyId) return undefined;
    let cancelled = false;
    async function load() {
      try {
        const data = await listClasses(activeCompanyId, { status: 'active' });
        if (!cancelled) setClasses(data?.classes || data || []);
      } catch (_) { /* ignore */ }
    }
    load();
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required');
      return;
    }
    if (form.audience === 'class' && !form.classId) {
      setError('Please select a class');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
      };
      if (form.audience === 'class') {
        payload.classId = form.classId;
      }
      if (form.expiresAt) {
        payload.expiresAt = new Date(form.expiresAt).toISOString();
      }
      await createAnnouncement(activeCompanyId, payload);
      router.push(paths.dashboard.announcements.root);
    } catch (err) {
      setError(err.message || 'Failed to create announcement');
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
            <h1 className="text-2xl font-bold tracking-tight">Create Announcement</h1>
            <p className="text-sm text-muted-foreground">Post an announcement to your students.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Announcement title..."
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="body">Body *</Label>
            <Textarea
              id="body"
              placeholder="Write your announcement..."
              rows={6}
              value={form.body}
              onChange={(e) => updateField('body', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="audience">Audience</Label>
              <select
                id="audience"
                value={form.audience}
                onChange={(e) => updateField('audience', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="organization">Entire Organisation</option>
                <option value="class">Specific Class</option>
              </select>
            </div>

            {form.audience === 'class' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="classId">Class *</Label>
                <select
                  id="classId"
                  value={form.classId}
                  onChange={(e) => updateField('classId', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select a class...</option>
                  {classes.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expiresAt">Expires At (optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => updateField('expiresAt', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Announcement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
