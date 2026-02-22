'use client';

import { Badge } from '@/components/ui/badge';

interface AccessBadgeProps {
  status: 'purchased' | 'free' | 'locked';
}

const CONFIG = {
  purchased: { label: 'Purchased', variant: 'default' as const },
  free: { label: 'Free', variant: 'secondary' as const },
  locked: { label: 'Locked', variant: 'outline' as const },
};

export function AccessBadge({ status }: AccessBadgeProps) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
