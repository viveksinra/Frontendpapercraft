'use client';

import { useParams } from 'next/navigation';

import HomeworkDetailView from 'src/components/homework/HomeworkDetailView';

export default function HomeworkDetailPage() {
  const { homeworkId } = useParams();
  return <HomeworkDetailView homeworkId={homeworkId} />;
}
