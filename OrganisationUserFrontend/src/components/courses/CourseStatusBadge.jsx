'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'default' },
  archived: { label: 'Archived', variant: 'outline' },
};

export default function CourseStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
