'use client';

import { useParams } from 'next/navigation';
import { HomeworkDetail } from '@/components/student/HomeworkDetail';

export default function HomeworkDetailPage() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  return <HomeworkDetail homeworkId={homeworkId} />;
}
