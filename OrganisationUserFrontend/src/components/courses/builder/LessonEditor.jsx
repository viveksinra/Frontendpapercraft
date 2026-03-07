'use client';

import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LessonEditor({
  lesson,
  onSave,
  onClose,
  saving = false,
  contentEditor,
}) {
  const [form, setForm] = useState({
    title: '',
    isFree: false,
    estimatedMinutes: 0,
    isPublished: true,
    dripDate: '',
  });

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title || '',
        isFree: lesson.isFree || false,
        estimatedMinutes: lesson.estimatedMinutes || 0,
        isPublished: lesson.isPublished !== false,
        dripDate: lesson.dripDate
          ? new Date(lesson.dripDate).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [lesson]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    const data = { ...form };
    if (data.dripDate) {
      data.dripDate = new Date(data.dripDate).toISOString();
    } else {
      delete data.dripDate;
    }
    onSave(data);
  }

  if (!lesson) return null;

  return (
    <div className="border-l bg-card p-4 flex flex-col gap-4 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Edit Lesson</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Title</label>
        <Input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Lesson title"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Estimated Duration (minutes)</label>
        <Input
          type="number"
          min="0"
          value={form.estimatedMinutes}
          onChange={(e) => update('estimatedMinutes', parseInt(e.target.value, 10) || 0)}
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFree}
            onChange={(e) => update('isFree', e.target.checked)}
            className="rounded border-input"
          />
          Free Preview
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update('isPublished', e.target.checked)}
            className="rounded border-input"
          />
          Published
        </label>
      </div>

      {/* Drip Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">Drip Date (optional)</label>
        <Input
          type="datetime-local"
          value={form.dripDate}
          onChange={(e) => update('dripDate', e.target.value)}
        />
      </div>

      {/* Content Editor slot */}
      {contentEditor && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">Content</label>
          {contentEditor}
        </div>
      )}

      {/* Save */}
      <Button onClick={handleSave} disabled={saving} className="mt-auto">
        {saving && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}
