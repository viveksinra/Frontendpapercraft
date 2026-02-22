'use client';

import { User } from 'lucide-react';

interface CourseInstructorCardProps {
  course: any;
}

export default function CourseInstructorCard({ course }: CourseInstructorCardProps) {
  const teacher = course.teacherName || 'Instructor';

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3">Instructor</h3>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{teacher}</p>
          {course.instituteName && (
            <p className="text-xs text-muted-foreground">{course.instituteName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
