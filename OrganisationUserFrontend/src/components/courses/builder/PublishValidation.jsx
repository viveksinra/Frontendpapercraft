'use client';

import { XCircle, CheckCircle2 } from 'lucide-react';

function Check({ label, passed }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      )}
      <span className={passed ? 'text-foreground' : 'text-red-600 dark:text-red-400'}>{label}</span>
    </div>
  );
}

export default function PublishValidation({ course }) {
  const sections = course?.sections || [];
  const hasSections = sections.length > 0;
  const allSectionsHaveLessons = hasSections && sections.every((s) => s.lessons?.length > 0);
  const allLessonsHaveContent = hasSections && sections.every((s) =>
    s.lessons?.every((l) => l.content && Object.keys(l.content).length > 0)
  );
  const hasThumbnail = !!course?.thumbnail;

  const allPassed = hasSections && allSectionsHaveLessons && allLessonsHaveContent;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
      <h3 className="text-sm font-medium">Publish Checklist</h3>
      <div className="flex flex-col gap-2">
        <Check label="At least 1 section" passed={hasSections} />
        <Check label="Every section has at least 1 lesson" passed={allSectionsHaveLessons} />
        <Check label="All lessons have content" passed={allLessonsHaveContent} />
        <Check label="Thumbnail set (recommended)" passed={hasThumbnail} />
      </div>
      {!allPassed && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Cannot publish until all required checks pass.
        </p>
      )}
    </div>
  );
}
