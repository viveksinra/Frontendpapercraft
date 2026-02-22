'use client';

import { use } from 'react';
import { TestTakingLayout } from '@/components/test-taking/TestTakingLayout';

export default function TakeTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  return <TestTakingLayout testId={testId} />;
}
