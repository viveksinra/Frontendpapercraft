'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getProfile, updateProfile } from '@/lib/student-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().optional(),
  yearGroup: z.string().optional(),
  school: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function StudentProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', dateOfBirth: '', yearGroup: '', school: '' },
  });

  useEffect(() => {
    async function load() {
      try {
        const profile = await getProfile();
        form.reset({
          name: profile.name || '',
          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
          yearGroup: profile.yearGroup || '',
          school: profile.school || '',
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateProfile(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
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
        <CardTitle className="text-base">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" {...form.register('dateOfBirth')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year Group</Label>
            <Input id="yearGroup" placeholder="e.g. Year 10" {...form.register('yearGroup')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input id="school" placeholder="Your school name" {...form.register('school')} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
