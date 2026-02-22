'use client';

import InstituteAnalyticsTab from 'src/components/analytics/InstituteAnalyticsTab';

// ----------------------------------------------------------------------

export default function InstituteAnalyticsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Institute Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Business intelligence and operational insights for your institute.
          </p>
        </div>
        <InstituteAnalyticsTab />
      </div>
    </div>
  );
}
