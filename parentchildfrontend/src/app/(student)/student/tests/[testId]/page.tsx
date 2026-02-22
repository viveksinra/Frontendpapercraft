'use client';

import { use } from 'react';
import { TestInfoScreen } from '@/components/student/TestInfoScreen';

export default function TestInfoPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  return <TestInfoScreen testId={testId} />;
}
