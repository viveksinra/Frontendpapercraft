'use client';

import { useParams } from 'next/navigation';

import CourseBuilder from 'src/components/courses/builder/CourseBuilder';

export default function CourseBuilderPage() {
  const { courseId } = useParams();
  return <CourseBuilder courseId={courseId} />;
}
