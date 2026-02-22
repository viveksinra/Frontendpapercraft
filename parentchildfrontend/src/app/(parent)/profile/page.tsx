'use client';

import { ParentProfileForm } from '@/components/parent/ParentProfileForm';

export default function ParentProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and notification preferences.
        </p>
      </div>

      <ParentProfileForm />
    </div>
  );
}
