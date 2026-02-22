'use client';

import { use } from 'react';
import { ResultDetail } from '@/components/student/ResultDetail';

export default function ResultDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  return <ResultDetail testId={testId} />;
}
