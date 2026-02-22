'use client';

import { useParams } from 'next/navigation';
import { ChildHomeworkList } from '@/components/parent/ChildHomeworkList';

export default function ChildHomeworkPage() {
  const { childId } = useParams<{ childId: string }>();
  return <ChildHomeworkList childId={childId} />;
}
