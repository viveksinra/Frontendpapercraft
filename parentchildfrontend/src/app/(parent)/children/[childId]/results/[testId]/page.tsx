'use client';

import { useParams } from 'next/navigation';
import { ChildResultDetail } from '@/components/parent/ChildResultDetail';

export default function ChildResultDetailPage() {
  const params = useParams();
  const childId = params.childId as string;
  const testId = params.testId as string;

  return (
    <div className="space-y-6">
      <ChildResultDetail childId={childId} testId={testId} />
    </div>
  );
}
