'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_MAP = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  scheduled: { label: 'Scheduled', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  live: { label: 'Live', className: 'bg-red-100 text-red-800 border-red-200 animate-pulse' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export default function TestStatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
