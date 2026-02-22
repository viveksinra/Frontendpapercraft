'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getCourse, updateCourse } from 'src/lib/course-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import CourseTagInput from './CourseTagInput';
import CoursePricingForm from './CoursePricingForm';
import ThumbnailUploader from './ThumbnailUploader';

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'all_levels'];
const CATEGORY_OPTIONS = [
  'Mathematics', 'English', 'Science', 'History', 'Geography',
  'Computer Science', 'Languages', '11+ Preparation', 'Entrance Exams', 'Other',
];

export default function EditCourseForm({ courseId }) {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    level: 'all_levels',
    targetExamType: '',
    tags: [],
    thumbnail: '',
    pricing: { isFree: true, basePrice: 0, currency: 'GBP' },
    welcomeMessage: '',
    completionMessage: '',
    certificateEnabled: false,
  });

  const load = useCallback(async () => {
    try {
      const data = await getCourse(companyId, courseId);
      const c = data?.course || data;
      if (c) {
        setForm({
          title: c.title || '',
          shortDescription: c.shortDescription || '',
          description: c.description || '',
          category: c.category || '',
          level: c.level || 'all_levels',
          targetExamType: c.targetExamType || '',
          tags: c.tags || [],
          thumbnail: c.thumbnail || '',
          pricing: c.pricing || { isFree: true, basePrice: 0, currency: 'GBP' },
          welcomeMessage: c.welcomeMessage || '',
          completionMessage: c.completionMessage || '',
          certificateEnabled: c.certificateEnabled || false,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId]);

  useEffect(() => { load(); }, [load]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateCourse(companyId, courseId, form);
      router.push(paths.dashboard.courses.detail(courseId));
    } catch (err) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.courses.detail(courseId))}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-sm text-muted-foreground">Update course metadata.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Short Description</label>
            <Input value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Description</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Level</label>
              <select
                value={form.level}
                onChange={(e) => update('level', e.target.value)}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Target Exam Type</label>
            <Input value={form.targetExamType} onChange={(e) => update('targetExamType', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Tags</label>
            <CourseTagInput tags={form.tags} onChange={(tags) => update('tags', tags)} />
          </div>

          <ThumbnailUploader courseId={courseId} value={form.thumbnail} onChange={(v) => update('thumbnail', v)} />

          <CoursePricingForm pricing={form.pricing} onChange={(p) => update('pricing', p)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Welcome Message</label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Shown after enrollment..."
              value={form.welcomeMessage}
              onChange={(e) => update('welcomeMessage', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Completion Message</label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Shown when course completed..."
              value={form.completionMessage}
              onChange={(e) => update('completionMessage', e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.certificateEnabled}
              onChange={(e) => update('certificateEnabled', e.target.checked)}
              className="rounded border-input"
            />
            Enable certificate on completion
          </label>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(paths.dashboard.courses.detail(courseId))}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
