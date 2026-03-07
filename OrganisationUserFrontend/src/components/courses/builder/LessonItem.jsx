'use client';

import {
  Type,
  Video,
  Clock,
  Trash2,
  FileText,
  Paperclip,
  HelpCircle,
  GripVertical,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TYPE_ICONS = {
  video: Video,
  pdf: FileText,
  text: Type,
  quiz: HelpCircle,
  resource: Paperclip,
};

export default function LessonItem({ lesson, onSelect, onDelete, dragHandleProps }) {
  const Icon = TYPE_ICONS[lesson.type] || FileText;
  const hasContent = !!lesson.content;

  return (
    <div
      className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 hover:bg-accent/50 cursor-pointer group"
      onClick={() => onSelect?.(lesson)}
    >
      <span {...dragHandleProps} className="cursor-grab" onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </span>

      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

      <span className="text-sm flex-1 truncate">{lesson.title}</span>

      {lesson.isFree && (
        <Badge variant="outline" className="text-xs">Free Preview</Badge>
      )}

      {lesson.estimatedMinutes > 0 && (
        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
          <Clock className="h-3 w-3" /> {lesson.estimatedMinutes}m
        </span>
      )}

      {!hasContent && (
        <Badge variant="destructive" className="text-xs">No Content</Badge>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); onDelete?.(lesson); }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
