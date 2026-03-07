'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Eye, Plus, Loader2, ArrowLeft, Upload as UploadIcon } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getCourse,
  addLesson,
  addSection,
  updateLesson,
  deleteLesson,
  publishCourse,
  updateSection,
  deleteSection,
  setLessonContent,
} from 'src/lib/course-api';

import { Button } from '@/components/ui/button';

import SectionForm from './SectionForm';
import SectionItem from './SectionItem';
import PdfUploader from './PdfUploader';
import LessonEditor from './LessonEditor';
import QuizSelector from './QuizSelector';
import VideoUploader from './VideoUploader';
import ResourceUploader from './ResourceUploader';
import CourseStatusBadge from '../CourseStatusBadge';
import RichTextLessonEditor from './RichTextLessonEditor';

// ─────────────────────────────────────────────────────────────────

export default function CourseBuilder({ courseId }) {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [addingSection, setAddingSection] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const loadCourse = useCallback(async () => {
    if (!companyId || !courseId) return;
    try {
      setLoading(true);
      const data = await getCourse(companyId, courseId);
      setCourse(data?.course || data);
    } catch (err) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [companyId, courseId]);

  useEffect(() => { loadCourse(); }, [loadCourse]);

  // Section handlers
  async function handleAddSection(title) {
    try {
      setSaving(true);
      await addSection(companyId, courseId, { title });
      setAddingSection(false);
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSectionTitle(section, title) {
    try {
      await updateSection(companyId, courseId, section._id, { title });
      await loadCourse();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSection(section) {
    if (!confirm('Delete this section and all its lessons?')) return;
    try {
      await deleteSection(companyId, courseId, section._id);
      await loadCourse();
    } catch (err) {
      setError(err.message);
    }
  }

  // Lesson handlers
  async function handleAddLesson(section, type) {
    try {
      setSaving(true);
      await addLesson(companyId, courseId, section._id, {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
        type,
      });
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSelectLesson(lesson) {
    // Find the section containing this lesson
    const section = course?.sections?.find((s) =>
      s.lessons?.some((l) => (l._id || l.id) === (lesson._id || lesson.id))
    );
    setSelectedLesson(lesson);
    setSelectedSection(section);
  }

  async function handleUpdateLesson(data) {
    if (!selectedLesson || !selectedSection) return;
    try {
      setSaving(true);
      await updateLesson(
        companyId, courseId, selectedSection._id,
        selectedLesson._id || selectedLesson.id, data
      );
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson(lesson) {
    if (!confirm('Delete this lesson?')) return;
    const section = course?.sections?.find((s) =>
      s.lessons?.some((l) => (l._id || l.id) === (lesson._id || lesson.id))
    );
    if (!section) return;
    try {
      await deleteLesson(companyId, courseId, section._id, lesson._id || lesson.id);
      if ((selectedLesson?._id || selectedLesson?.id) === (lesson._id || lesson.id)) {
        setSelectedLesson(null);
        setSelectedSection(null);
      }
      await loadCourse();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSetContent(contentData) {
    if (!selectedLesson || !selectedSection) return;
    try {
      setSaving(true);
      await setLessonContent(
        companyId, courseId, selectedSection._id,
        selectedLesson._id || selectedLesson.id,
        { contentType: selectedLesson.type, ...contentData }
      );
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    try {
      setPublishing(true);
      setError(null);
      await publishCourse(companyId, courseId);
      await loadCourse();
    } catch (err) {
      setError(err.message || 'Publish failed. Ensure all sections have lessons with content.');
    } finally {
      setPublishing(false);
    }
  }

  // Content editor based on lesson type
  function getContentEditor() {
    if (!selectedLesson) return null;
    const type = selectedLesson.type;
    const content = selectedLesson.content || {};

    switch (type) {
      case 'video':
        return (
          <VideoUploader
            courseId={courseId}
            value={content}
            onContentSet={handleSetContent}
          />
        );
      case 'pdf':
        return (
          <PdfUploader
            courseId={courseId}
            value={content}
            onContentSet={handleSetContent}
          />
        );
      case 'text':
        return (
          <RichTextLessonEditor
            value={content.htmlContent || ''}
            onChange={(htmlContent) => handleSetContent({ htmlContent })}
          />
        );
      case 'quiz':
        return (
          <QuizSelector
            companyId={companyId}
            value={content.testId}
            onChange={(testId) => handleSetContent({ testId })}
          />
        );
      case 'resource':
        return (
          <ResourceUploader
            courseId={courseId}
            value={content}
            onContentSet={handleSetContent}
          />
        );
      default:
        return <p className="text-sm text-muted-foreground">Unknown lesson type: {type}</p>;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container max-w-screen-md mx-auto px-4 py-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    );
  }

  const sections = course?.sections || [];
  const totalLessons = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left: Course structure */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Header bar */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(paths.dashboard.courses.detail(courseId))}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{course?.title}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CourseStatusBadge status={course?.status} />
              <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
              <span>{totalLessons} lesson{totalLessons !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(paths.dashboard.courses.preview(courseId))}
          >
            <Eye className="mr-1 h-3.5 w-3.5" /> Preview
          </Button>
          {course?.status === 'draft' && (
            <Button size="sm" onClick={handlePublish} disabled={publishing}>
              {publishing && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              <UploadIcon className="mr-1 h-3.5 w-3.5" /> Publish
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-4">
            {error}
          </div>
        )}

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <SectionItem
              key={section._id || section.id}
              section={section}
              onEditTitle={handleEditSectionTitle}
              onDelete={handleDeleteSection}
              onAddLesson={handleAddLesson}
              onSelectLesson={handleSelectLesson}
              onDeleteLesson={handleDeleteLesson}
              dragHandleProps={{}}
            />
          ))}

          {/* Add section */}
          {addingSection ? (
            <SectionForm
              onSubmit={handleAddSection}
              onCancel={() => setAddingSection(false)}
              saving={saving}
            />
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setAddingSection(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          )}
        </div>
      </div>

      {/* Right: Lesson editor panel */}
      {selectedLesson && (
        <LessonEditor
          lesson={selectedLesson}
          onSave={handleUpdateLesson}
          onClose={() => { setSelectedLesson(null); setSelectedSection(null); }}
          saving={saving}
          contentEditor={getContentEditor()}
        />
      )}
    </div>
  );
}
