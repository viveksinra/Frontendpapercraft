'use client';

import { useParams } from 'next/navigation';

import EditCourseForm from 'src/components/courses/EditCourseForm';

export default function EditCoursePage() {
  const { courseId } = useParams();
  return <EditCourseForm courseId={courseId} />;
}
