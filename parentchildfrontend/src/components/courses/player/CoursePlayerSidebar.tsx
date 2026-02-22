'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Lock, Clock, Video, FileText, Type, HelpCircle, Paperclip } from 'lucide-react';

interface CoursePlayerSidebarProps {
  course: any;
  progress: any;
  currentSectionId: string;
  currentLessonId: string;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
}

const TYPE_ICONS: Record<string, any> = {
  video: Video,
  pdf: FileText,
  text: Type,
  quiz: HelpCircle,
  resource: Paperclip,
};

export default function CoursePlayerSidebar({
  course,
  progress,
  currentSectionId,
  currentLessonId,
  onSelectLesson,
}: CoursePlayerSidebarProps) {
  const sections = course.sections || [];
  const completedLessons = new Set(
    (progress?.completedLessons || []).map((l: any) => l.lessonId || l)
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((s: any) => {
      initial[s._id] = s._id === currentSectionId;
    });
    return initial;
  });

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function isLessonDripLocked(lesson: any) {
    if (!lesson.dripDate) return false;
    return new Date(lesson.dripDate) > new Date();
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm truncate">{course.title}</h3>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {sections.map((section: any) => {
          const isExpanded = expandedSections[section._id];
          const lessons = section.lessons || [];
          const sectionCompleted = lessons.every((l: any) => completedLessons.has(l._id));

          return (
            <div key={section._id}>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => toggleSection(section._id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="flex-1 truncate font-medium text-xs">{section.title}</span>
                {sectionCompleted && (
                  <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                )}
              </button>
              {isExpanded && (
                <div>
                  {lessons.map((lesson: any) => {
                    const isActive = lesson._id === currentLessonId;
                    const isComplete = completedLessons.has(lesson._id);
                    const isDripLocked = isLessonDripLocked(lesson);
                    const Icon = TYPE_ICONS[lesson.type] || FileText;

                    return (
                      <button
                        key={lesson._id}
                        className={`flex items-center gap-2 w-full px-3 pl-8 py-2 text-left text-xs transition-colors min-h-[36px] ${
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent/50 text-muted-foreground'
                        } ${isDripLocked ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (!isDripLocked) onSelectLesson(section._id, lesson._id);
                        }}
                        disabled={isDripLocked}
                        title={
                          isDripLocked
                            ? `Available on ${new Date(lesson.dripDate).toLocaleDateString()}`
                            : lesson.title
                        }
                      >
                        {isComplete ? (
                          <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                        ) : isDripLocked ? (
                          <Lock className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
