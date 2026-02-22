'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, BookOpen, Star, Video, FileText, Type, HelpCircle, Paperclip, Lock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const TYPE_ICONS = {
  video: Video,
  pdf: FileText,
  text: Type,
  quiz: HelpCircle,
  resource: Paperclip,
};

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
}

function SectionPreview({ section }) {
  const [expanded, setExpanded] = useState(false);
  const lessons = section.lessons || [];
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.estimatedMinutes || 0), 0);

  return (
    <div className="border rounded-md">
      <button
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-accent/50"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="text-sm font-medium flex-1">{section.title}</span>
        <span className="text-xs text-muted-foreground">
          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} · {formatDuration(totalMinutes)}
        </span>
      </button>
      {expanded && (
        <div className="border-t px-4 py-2 flex flex-col gap-1">
          {lessons.map((lesson) => {
            const Icon = TYPE_ICONS[lesson.type] || FileText;
            return (
              <div key={lesson._id || lesson.id} className="flex items-center gap-2 py-1.5 text-sm">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1">{lesson.title}</span>
                {lesson.isFree ? (
                  <Badge variant="outline" className="text-xs">Preview</Badge>
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
                {lesson.estimatedMinutes > 0 && (
                  <span className="text-xs text-muted-foreground">{lesson.estimatedMinutes}m</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CoursePreview({ course }) {
  if (!course) return null;

  const sections = course.sections || [];
  const stats = course.stats || {};
  const pricing = course.pricing || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="flex gap-6">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-64 h-40 rounded-lg object-cover" />
        ) : (
          <div className="w-64 h-40 rounded-lg bg-muted flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          {course.shortDescription && (
            <p className="text-muted-foreground">{course.shortDescription}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {stats.totalLessons || 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {formatDuration(stats.totalDurationMinutes)}
            </span>
            {stats.avgRating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {stats.avgRating.toFixed(1)} ({stats.ratingCount} reviews)
              </span>
            )}
          </div>
          <div className="text-lg font-bold mt-2">
            {pricing.isFree ? (
              <span className="text-green-600 dark:text-green-400">FREE</span>
            ) : (
              <span>{pricing.currency === 'INR' ? '₹' : '£'}{(pricing.basePrice || 0).toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
      )}

      {/* Curriculum */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Course Content</h2>
        {sections.map((section) => (
          <SectionPreview key={section._id || section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
