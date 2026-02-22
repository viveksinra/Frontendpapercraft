'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCourseProgress, getLessonContent, markLessonComplete, trackTimeSpent } from '@/lib/course-api';
import CoursePlayerSidebar from './CoursePlayerSidebar';
import CoursePlayerContent from './CoursePlayerContent';
import ProgressBar from './ProgressBar';
import LessonNavigation from './LessonNavigation';
import LessonCompleteButton from './LessonCompleteButton';
import AutoAdvanceToggle from './AutoAdvanceToggle';
import DripLockOverlay from './DripLockOverlay';
import { Loader2, Menu, X } from 'lucide-react';

interface CoursePlayerProps {
  courseId: string;
}

interface FlatLesson {
  sectionId: string;
  sectionTitle: string;
  lesson: any;
  index: number;
}

export default function CoursePlayer({ courseId }: CoursePlayerProps) {
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [currentLessonId, setCurrentLessonId] = useState('');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(0);

  // Flatten sections into lesson list
  const flatLessons: FlatLesson[] = [];
  if (course?.sections) {
    let idx = 0;
    for (const section of course.sections) {
      for (const lesson of section.lessons || []) {
        flatLessons.push({ sectionId: section._id, sectionTitle: section.title, lesson, index: idx++ });
      }
    }
  }

  const currentFlatIndex = flatLessons.findIndex(
    (fl) => fl.lesson._id === currentLessonId && fl.sectionId === currentSectionId
  );
  const currentFlat = flatLessons[currentFlatIndex];
  const prevFlat = currentFlatIndex > 0 ? flatLessons[currentFlatIndex - 1] : null;
  const nextFlat = currentFlatIndex < flatLessons.length - 1 ? flatLessons[currentFlatIndex + 1] : null;

  const completedSet = new Set(
    (progress?.completedLessons || []).map((l: any) => l.lessonId || l)
  );
  const totalLessons = flatLessons.length;
  const completedCount = completedSet.size;
  const percentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const isCurrentComplete = currentLessonId ? completedSet.has(currentLessonId) : false;

  function isDripLocked(lesson: any) {
    return lesson.dripDate && new Date(lesson.dripDate) > new Date();
  }

  const loadContent = useCallback(async (sectionId: string, lessonId: string) => {
    setContentLoading(true);
    try {
      const data = await getLessonContent(courseId, sectionId, lessonId);
      setLessonContent(data);
    } catch {
      setLessonContent(null);
    } finally {
      setContentLoading(false);
    }
  }, [courseId]);

  // Load course progress
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCourseProgress(courseId);
        setCourse(data.course || data);
        setProgress(data.progress || data);

        // Set initial lesson
        const sections = (data.course || data).sections || [];
        const currentLessonIdFromProgress = data.progress?.currentLessonId;
        if (currentLessonIdFromProgress) {
          for (const sec of sections) {
            const found = (sec.lessons || []).find((l: any) => l._id === currentLessonIdFromProgress);
            if (found) {
              setCurrentSectionId(sec._id);
              setCurrentLessonId(found._id);
              break;
            }
          }
        } else if (sections.length > 0 && sections[0].lessons?.length > 0) {
          setCurrentSectionId(sections[0]._id);
          setCurrentLessonId(sections[0].lessons[0]._id);
        }
      } catch {
        // error handled by interceptor
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  // Load lesson content when current lesson changes
  useEffect(() => {
    if (currentSectionId && currentLessonId) {
      const lesson = currentFlat?.lesson;
      if (lesson && !isDripLocked(lesson)) {
        loadContent(currentSectionId, currentLessonId);
      }
    }
  }, [currentSectionId, currentLessonId, loadContent]);

  // Time tracking
  useEffect(() => {
    secondsRef.current = 0;
    timeRef.current = setInterval(() => {
      secondsRef.current += 10;
    }, 10000);

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
      if (secondsRef.current > 0 && currentSectionId && currentLessonId) {
        trackTimeSpent(courseId, {
          sectionId: currentSectionId,
          lessonId: currentLessonId,
          seconds: secondsRef.current,
        }).catch(() => {});
      }
    };
  }, [courseId, currentSectionId, currentLessonId]);

  function selectLesson(sectionId: string, lessonId: string) {
    // Flush time tracking
    if (secondsRef.current > 0 && currentSectionId && currentLessonId) {
      trackTimeSpent(courseId, {
        sectionId: currentSectionId,
        lessonId: currentLessonId,
        seconds: secondsRef.current,
      }).catch(() => {});
      secondsRef.current = 0;
    }
    setCurrentSectionId(sectionId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
  }

  function handleCompleteToggle(completed: boolean) {
    if (completed) {
      completedSet.add(currentLessonId);
      if (autoAdvance && nextFlat && !isDripLocked(nextFlat.lesson)) {
        setTimeout(() => selectLesson(nextFlat.sectionId, nextFlat.lesson._id), 500);
      }
    } else {
      completedSet.delete(currentLessonId);
    }
    setProgress((prev: any) => ({
      ...prev,
      completedLessons: completed
        ? [...(prev?.completedLessons || []), { lessonId: currentLessonId }]
        : (prev?.completedLessons || []).filter((l: any) => (l.lessonId || l) !== currentLessonId),
    }));
  }

  function handleQuizComplete(score: number) {
    markLessonComplete(courseId, {
      sectionId: currentSectionId,
      lessonId: currentLessonId,
      quizScore: score,
    }).then(() => handleCompleteToggle(true)).catch(() => {});
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  const currentLesson = currentFlat?.lesson;
  const isLocked = currentLesson && isDripLocked(currentLesson);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 md:-m-6">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-72 border-r bg-background flex-col shrink-0">
        <CoursePlayerSidebar
          course={course}
          progress={progress}
          currentSectionId={currentSectionId}
          currentLessonId={currentLessonId}
          onSelectLesson={selectLesson}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-background shadow-lg">
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-semibold text-sm">Course Outline</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <CoursePlayerSidebar
              course={course}
              progress={progress}
              currentSectionId={currentSectionId}
              currentLessonId={currentLessonId}
              onSelectLesson={selectLesson}
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b">
          <ProgressBar percentage={percentage} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentLesson && (
            <h2 className="text-lg font-semibold mb-4">{currentLesson.title}</h2>
          )}

          {contentLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isLocked ? (
            <DripLockOverlay dripDate={currentLesson.dripDate} />
          ) : (
            <CoursePlayerContent
              lesson={currentLesson}
              content={lessonContent}
              courseId={courseId}
              sectionId={currentSectionId}
              onQuizComplete={handleQuizComplete}
            />
          )}
        </div>

        <div className="border-t px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <LessonCompleteButton
              courseId={courseId}
              sectionId={currentSectionId}
              lessonId={currentLessonId}
              isCompleted={isCurrentComplete}
              isLocked={!!isLocked}
              onToggle={handleCompleteToggle}
            />
            <AutoAdvanceToggle enabled={autoAdvance} onToggle={setAutoAdvance} />
          </div>
          <LessonNavigation
            onPrev={() => prevFlat && selectLesson(prevFlat.sectionId, prevFlat.lesson._id)}
            onNext={() => nextFlat && selectLesson(nextFlat.sectionId, nextFlat.lesson._id)}
            hasPrev={!!prevFlat}
            hasNext={!!nextFlat}
            prevTitle={prevFlat?.lesson.title}
            nextTitle={nextFlat?.lesson.title}
          />
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden border-t flex items-center justify-around py-2">
          <button
            className="flex flex-col items-center gap-0.5 text-xs min-h-[44px] min-w-[44px] justify-center"
            onClick={() => prevFlat && selectLesson(prevFlat.sectionId, prevFlat.lesson._id)}
            disabled={!prevFlat}
          >
            Prev
          </button>
          <button
            className="flex flex-col items-center gap-0.5 text-xs min-h-[44px] min-w-[44px] justify-center"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            Outline
          </button>
          <button
            className="flex flex-col items-center gap-0.5 text-xs min-h-[44px] min-w-[44px] justify-center"
            onClick={() => nextFlat && selectLesson(nextFlat.sectionId, nextFlat.lesson._id)}
            disabled={!nextFlat}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
