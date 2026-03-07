'use client';

import { useParams } from 'next/navigation';

import ClassDetailView from 'src/components/classes/ClassDetailView';

export default function ClassDetailPage() {
  const { classId } = useParams();
  return <ClassDetailView classId={classId} />;
}
