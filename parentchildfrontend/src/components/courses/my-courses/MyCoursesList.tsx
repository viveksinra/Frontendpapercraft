'use client';

import MyCourseCard from './MyCourseCard';

interface MyCoursesListProps {
  enrollments: any[];
}

export default function MyCoursesList({ enrollments }: MyCoursesListProps) {
  if (!enrollments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No courses found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.map((enrollment) => (
        <MyCourseCard
          key={enrollment._id || enrollment.id}
          enrollment={enrollment}
        />
      ))}
    </div>
  );
}
