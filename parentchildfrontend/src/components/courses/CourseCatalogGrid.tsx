'use client';

import CourseCatalogCard from './CourseCatalogCard';

interface CourseCatalogGridProps {
  courses: any[];
  basePath?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CourseCatalogGrid({
  courses,
  basePath,
  page,
  totalPages,
  onPageChange,
}: CourseCatalogGridProps) {
  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No courses found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCatalogCard
            key={course._id || course.id || course.slug}
            course={course}
            basePath={basePath}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
