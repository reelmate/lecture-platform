'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VideoPlayer from '@/components/VideoPlayer';
import LessonSidebar from '@/components/LessonSidebar';
import ProgressBar from '@/components/ProgressBar';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { CourseWithSections, Lesson, LessonProgress } from '@/types';

interface Props {
  params: { courseId: string };
}

export default function LearnPage({ params }: Props) {
  const { courseId } = params;
  const [course, setCourse] = useState<CourseWithSections | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/login?redirect=/courses/${courseId}/learn`); return; }

      // Check enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (!enrollment) { router.push(`/courses/${courseId}`); return; }

      // Fetch course with sections and lessons
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (!courseData) { router.push('/'); return; }

      const { data: sections } = await supabase
        .from('sections')
        .select('*, lessons(*)')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      const sortedSections = (sections ?? []).map((s) => ({
        ...s,
        lessons: [...(s.lessons ?? [])].sort((a, b) => a.order_index - b.order_index),
      }));

      // Fetch progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      const fullCourse = { ...courseData, sections: sortedSections };
      setCourse(fullCourse);
      setProgress(progressData ?? []);

      // Start with first lesson
      if (sortedSections[0]?.lessons[0]) {
        setCurrentLesson(sortedSections[0].lessons[0]);
      }

      setLoading(false);
    }
    init();
  }, [courseId]);

  const allLessons = course?.sections.flatMap((s) => s.lessons) ?? [];

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const completedCount = progress.filter((p) => p.completed).length;
  const progressPercent = allLessons.length > 0
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  const markComplete = useCallback(async () => {
    if (!currentLesson) return;
    await fetch(`/api/lessons/${currentLesson.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    setProgress((prev) => {
      const existing = prev.find((p) => p.lesson_id === currentLesson.id);
      if (existing) {
        return prev.map((p) =>
          p.lesson_id === currentLesson.id ? { ...p, completed: true } : p
        );
      }
      return [...prev, {
        id: '',
        user_id: '',
        lesson_id: currentLesson.id,
        course_id: courseId,
        completed: true,
        progress_seconds: 0,
        last_watched_at: new Date().toISOString(),
      }];
    });
  }, [currentLesson, courseId]);

  const goNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const isCompleted = progress.some((p) => p.lesson_id === currentLesson.id && p.completed);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            나가기
          </button>
          <div className="flex-1 mx-6 max-w-sm">
            <div className="flex items-center gap-2">
              <ProgressBar value={progressPercent} className="flex-1" />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {completedCount}/{allLessons.length}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400">{course.title}</div>
        </div>

        {/* Video */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              key={currentLesson.id}
              lessonId={currentLesson.id}
              title={currentLesson.title}
            />

            {/* Lesson Info */}
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">{currentLesson.title}</h1>
                {currentLesson.description && (
                  <p className="text-gray-400 text-sm mt-2">{currentLesson.description}</p>
                )}
              </div>
              <button
                onClick={markComplete}
                disabled={isCompleted}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${isCompleted
                    ? 'bg-green-900/40 text-green-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? '완료됨' : '완료 표시'}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 강의
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                다음 강의
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 bg-gray-900 border-l border-gray-800 flex-shrink-0 overflow-y-auto">
        <LessonSidebar
          sections={course.sections}
          currentLessonId={currentLesson.id}
          progress={progress}
          onSelectLesson={setCurrentLesson}
        />
      </div>
    </div>
  );
}
