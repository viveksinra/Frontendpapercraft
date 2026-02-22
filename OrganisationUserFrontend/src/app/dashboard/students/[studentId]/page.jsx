'use client';

import { useParams } from 'next/navigation';

import StudentProfileView from 'src/components/students/StudentProfileView';

// ----------------------------------------------------------------------

export default function StudentProfilePage() {
  const { studentId } = useParams();

  return <StudentProfileView studentId={studentId} />;
}
