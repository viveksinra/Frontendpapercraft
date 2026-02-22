export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 min";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  return `${hours} ${hours === 1 ? "hr" : "hrs"} ${mins} min`;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const lessonTypeLabels: Record<string, string> = {
  video: "Video",
  pdf: "PDF",
  text: "Text",
  quiz: "Quiz",
  resource: "Resource",
};

export function getLessonTypeLabel(type: string): string {
  return lessonTypeLabels[type] || type;
}

const courseLevelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all_levels: "All Levels",
};

export function getCourseLevelLabel(level: string): string {
  return courseLevelLabels[level] || level;
}

export function calculateEstimatedTime(sections: Array<{ lessons: Array<{ estimatedMinutes?: number }> }>): number {
  let total = 0;
  for (const section of sections) {
    for (const lesson of section.lessons) {
      total += lesson.estimatedMinutes || 0;
    }
  }
  return total;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
