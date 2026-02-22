'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function QuestionStatusTabs({ activeStatus, onStatusChange, counts = {} }) {
  return (
    <Tabs value={activeStatus} onValueChange={onStatusChange}>
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
