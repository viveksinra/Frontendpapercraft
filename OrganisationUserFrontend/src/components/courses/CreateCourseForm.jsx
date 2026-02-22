'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { createCourse } from 'src/lib/course-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import CourseTagInput from './CourseTagInput';
import CoursePricingForm from './CoursePricingForm';

// ─────────────────────────────────────────────────────────────────

const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'all_levels'];
const CATEGORY_OPTIONS = [
  'Mathematics', 'English', 'Science', 'History', 'Geography',
  'Computer Science', 'Languages', '11+ Preparation', 'Entrance Exams', 'Other',
];

export default function CreateCourseForm() {
  const router = useRouter();
  const activeCompanyId = getActiveCompanyIdFromCookie();

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
    pricing: { isFree: true, basePrice: 0, currency: 'GBP' },
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const data = await createCourse(activeCompanyId, form);
      const courseId = data?.course?._id || data?._id || data?.id;
      if (courseId) {
        router.push(paths.dashboard.courses.builder(courseId));
      } else {
        router.push(paths.dashboard.courses.root);
      }
    } catch (err) {
      setError(err.message || 'Failed to create course');
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.courses.root)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Course</h1>
            <p className="text-sm text-muted-foreground">Set up your course metadata.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="e.g. 11+ Maths Mastery Course"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              required
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Short Description</label>
            <Input
              placeholder="Brief course summary (shown in catalog cards)"
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
            />
          </div>

          {/* Full Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Description</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Detailed course description..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          {/* Category + Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
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
                  <option key={l} value={l}>
                    {l.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Exam Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Target Exam Type</label>
            <Input
              placeholder="e.g. 11+, GCSE, A-Level"
              value={form.targetExamType}
              onChange={(e) => update('targetExamType', e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Tags</label>
            <CourseTagInput
              tags={form.tags}
              onChange={(tags) => update('tags', tags)}
            />
          </div>

          {/* Pricing */}
          <CoursePricingForm
            pricing={form.pricing}
            onChange={(pricing) => update('pricing', pricing)}
          />

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Course
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(paths.dashboard.courses.root)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
