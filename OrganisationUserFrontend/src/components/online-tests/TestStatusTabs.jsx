'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export default function TestStatusTabs({ currentTab, onTabChange, counts = {} }) {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange}>
      <TabsList>
        {STATUSES.map((s) => (
          <TabsTrigger key={s.value} value={s.value}>
            {s.label}
            {counts[s.value] != null && (
              <span className="ml-1.5 text-xs text-muted-foreground">({counts[s.value]})</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
