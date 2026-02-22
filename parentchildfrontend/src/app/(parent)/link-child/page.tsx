'use client';

import { LinkChildForm } from '@/components/parent/LinkChildForm';

export default function LinkChildPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link a Child</h1>
        <p className="mt-1 text-muted-foreground">
          Enter the student code to link your child&apos;s account.
        </p>
      </div>

      <LinkChildForm />
    </div>
  );
}
