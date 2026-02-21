'use client';

import { Badge } from '@/components/ui/badge';

const MODE_MAP = {
  live_mock: 'Live Mock',
  anytime_mock: 'Anytime Mock',
  practice: 'Practice',
  classroom: 'Classroom',
  section_timed: 'Section Timed',
};

export default function TestModeBadge({ mode }) {
  const label = MODE_MAP[mode] || mode;
  return (
    <Badge variant="secondary">
      {label}
    </Badge>
  );
}
