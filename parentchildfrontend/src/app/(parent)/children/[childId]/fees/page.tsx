'use client';

import { useParams } from 'next/navigation';
import { ChildFeesList } from '@/components/parent/ChildFeesList';

export default function ChildFeesPage() {
  const { childId } = useParams<{ childId: string }>();
  return <ChildFeesList childId={childId} />;
}
