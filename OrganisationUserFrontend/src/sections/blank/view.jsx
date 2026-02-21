'use client';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function BlankView({ title = 'Blank', description }) {
  return (
    <DashboardContent maxWidth="xl">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="mt-1">{description}</p>}

      <div className="mt-5 h-80 w-full rounded-lg border border-dashed border-border bg-muted/5" />
    </DashboardContent>
  );
}
