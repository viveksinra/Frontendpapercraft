'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_MAP = {
  draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  finalized: { label: 'Finalized', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800 border-green-200' },
};

export default function PaperStatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
