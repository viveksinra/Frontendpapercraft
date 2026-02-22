'use client';

import { StudentProfileForm } from '@/components/student/StudentProfileForm';
import { PreferencesPanel } from '@/components/student/PreferencesPanel';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile information and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentProfileForm />
        <PreferencesPanel />
      </div>
    </div>
  );
}
