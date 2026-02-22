'use client';

import QuestionAnalyticsTab from 'src/components/analytics/QuestionAnalyticsTab';

// ----------------------------------------------------------------------

export default function QuestionAnalyticsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Question Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Question bank quality analysis, difficulty calibration, and problematic question detection.
          </p>
        </div>
        <QuestionAnalyticsTab />
      </div>
    </div>
  );
}
