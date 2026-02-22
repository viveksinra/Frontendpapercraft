'use client';

import { Badge } from '@/components/ui/badge';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  hard: { label: 'Hard', color: 'bg-orange-100 text-orange-800' },
  very_hard: { label: 'Very Hard', color: 'bg-red-100 text-red-800' },
};

export default function QuestionDifficultyBadge({ difficulty }) {
  const config = DIFFICULTY_CONFIG[difficulty] || { label: difficulty || 'N/A', color: 'bg-gray-100 text-gray-800' };
  return (
    <Badge variant="outline" className={`${config.color} border-0 text-xs font-medium`}>
      {config.label}
    </Badge>
  );
}
