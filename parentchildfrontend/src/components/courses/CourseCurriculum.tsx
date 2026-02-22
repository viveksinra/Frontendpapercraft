'use client';

import CourseCurriculumSection from './CourseCurriculumSection';

interface CourseCurriculumProps {
  sections: any[];
  isEnrolled: boolean;
  onFreePreview?: (lesson: any) => void;
}

export default function CourseCurriculum({
  sections,
  isEnrolled,
  onFreePreview,
}: CourseCurriculumProps) {
  if (!sections?.length) {
    return <p className="text-sm text-muted-foreground">No curriculum available.</p>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Course Content</h2>
      <p className="text-sm text-muted-foreground">
        {sections.length} section{sections.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-2">
        {sections.map((section: any, i: number) => (
          <CourseCurriculumSection
            key={section._id || i}
            section={section}
            isEnrolled={isEnrolled}
            defaultOpen={i === 0}
            onFreePreview={onFreePreview}
          />
        ))}
      </div>
    </div>
  );
}
