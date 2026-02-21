'use client';

import { DashboardContent } from 'src/layouts/dashboard';

export default function LaunchpadView() {
  return (
    <DashboardContent>
      <div className="py-8 text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">PaperCraft Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to PaperCraft. Your assessment platform dashboard will be built here.
        </p>
      </div>
    </DashboardContent>
  );
}
