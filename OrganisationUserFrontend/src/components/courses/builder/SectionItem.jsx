'use client';

import { useState } from 'react';
import { GripVertical, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import SectionForm from './SectionForm';
import LessonItem from './LessonItem';

// ─────────────────────────────────────────────────────────────────

const LESSON_TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'text', label: 'Text' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'resource', label: 'Resource' },
];

export default function SectionItem({
  section,
  onEditTitle,
  onDelete,
  onAddLesson,
  onSelectLesson,
  onDeleteLesson,
  dragHandleProps,
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);

  const lessons = section.lessons || [];

  return (
    <div className="rounded-lg border bg-card">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <span {...dragHandleProps} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </span>

        <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {editing ? (
          <div className="flex-1">
            <SectionForm
              initialTitle={section.title}
              onSubmit={(title) => { onEditTitle?.(section, title); setEditing(false); }}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium flex-1 truncate">{section.title}</h3>
            <span className="text-xs text-muted-foreground">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete?.(section)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      {/* Lessons */}
      {expanded && (
        <div className="p-3 flex flex-col gap-2">
          {lessons.map((lesson) => (
            <LessonItem
              key={lesson._id || lesson.id}
              lesson={lesson}
              onSelect={onSelectLesson}
              onDelete={onDeleteLesson}
              dragHandleProps={{}}
            />
          ))}

          {/* Add lesson */}
          {showAddLesson ? (
            <div className="flex flex-wrap gap-2 p-2 rounded-md border border-dashed">
              <span className="text-xs text-muted-foreground w-full mb-1">Select lesson type:</span>
              {LESSON_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onAddLesson?.(section, type.value);
                    setShowAddLesson(false);
                  }}
                >
                  {type.label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setShowAddLesson(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full border border-dashed"
              onClick={() => setShowAddLesson(true)}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Lesson
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
