'use client';

import CourseCard from './CourseCard';

export default function CourseList({
  courses,
  onPublish,
  onUnpublish,
  onArchive,
  onDuplicate,
  onDelete,
}) {
  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">No courses found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course._id || course.id}
          course={course}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onArchive={onArchive}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
