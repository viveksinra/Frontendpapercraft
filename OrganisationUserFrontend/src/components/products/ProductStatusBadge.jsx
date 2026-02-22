'use client';

import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  draft: { label: 'Draft', variant: 'secondary' },
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'destructive' },
};

export default function ProductStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
