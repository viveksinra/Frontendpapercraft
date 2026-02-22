'use client';

import { useParams } from 'next/navigation';
import { ChildHomeworkDetail } from '@/components/parent/ChildHomeworkDetail';

export default function ChildHomeworkDetailPage() {
  const { childId, homeworkId } = useParams<{ childId: string; homeworkId: string }>();
  return <ChildHomeworkDetail childId={childId} homeworkId={homeworkId} />;
}
