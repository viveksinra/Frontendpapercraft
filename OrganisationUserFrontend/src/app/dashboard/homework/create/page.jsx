'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listClasses } from 'src/lib/class-api';
import { createHomework } from 'src/lib/homework-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// ----------------------------------------------------------------------

export default function CreateHomeworkPage() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    classId: '',
    title: '',
    description: '',
    type: 'questions',
    dueDate: '',
    lateSubmissionAllowed: false,
    lateDeadline: '',
  });

  useEffect(() => {
    if (!activeCompanyId) return;
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
    if (!form.classId || !form.title.trim() || !form.dueDate) {
      setError('Class, title, and due date are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = {
        classId: form.classId,
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        dueDate: new Date(form.dueDate).toISOString(),
        lateSubmissionAllowed: form.lateSubmissionAllowed,
      };
      if (form.lateSubmissionAllowed && form.lateDeadline) {
        payload.lateDeadline = new Date(form.lateDeadline).toISOString();
      }
      await createHomework(activeCompanyId, payload);
      router.push(paths.dashboard.homework.root);
    } catch (err) {
      setError(err.message || 'Failed to create homework');
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
            <h1 className="text-2xl font-bold tracking-tight">Create Homework</h1>
            <p className="text-sm text-muted-foreground">Assign homework to a class.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  {c.name} {c.yearGroup ? `(${c.yearGroup})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Week 3 Maths Practice"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Instructions for students..."
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="questions">Questions</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lateSubmission"
              checked={form.lateSubmissionAllowed}
              onChange={(e) => updateField('lateSubmissionAllowed', e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="lateSubmission">Allow late submissions</Label>
          </div>

          {form.lateSubmissionAllowed && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lateDeadline">Late Deadline</Label>
              <Input
                id="lateDeadline"
                type="datetime-local"
                value={form.lateDeadline}
                onChange={(e) => updateField('lateDeadline', e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Homework
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
