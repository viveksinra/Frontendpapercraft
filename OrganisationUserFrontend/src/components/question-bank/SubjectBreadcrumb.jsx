'use client';

export default function SubjectBreadcrumb({ question }) {
  const parts = [];
  const meta = question?.metadata;
  if (!meta) return <span className="text-muted-foreground text-xs">No subject</span>;

  if (meta.subjectId?.name) parts.push(meta.subjectId.name);
  if (meta.chapterId?.name) parts.push(meta.chapterId.name);
  if (meta.topicId?.name) parts.push(meta.topicId.name);

  if (parts.length === 0) {
    return <span className="text-muted-foreground text-xs">No subject</span>;
  }

  return (
    <span className="text-xs text-muted-foreground truncate max-w-[200px] inline-block" title={parts.join(' > ')}>
      {parts.join(' > ')}
    </span>
  );
}
