'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VideoPlayer from '@/components/VideoPlayer';
import ProgressBar from '@/components/ProgressBar';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  description?: string;
  order_num: number;
}

interface Props {
  params: { courseId: string };
}

export default function LearnPage({ params }: Props) {
  const { courseId } = params;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/login?redirect=/courses/${courseId}/learn`); return; }

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (!enrollment) { router.push(`/courses/${courseId}`); return; }

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_num', { ascending: true });

      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('completed', true);

      setLessons(lessonsData ?? []);
      setProgress((progressData ?? []).map((p) => p.lesson_id));
      if (lessonsData?.[0]) setCurrentLesson(lessonsData[0]);
      setLoading(false);
    }
    init();
  }, [courseId]);

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
  const progressPercent = lessons.length > 0
    ? Math.round((progress.length / lessons.length) * 100)
    : 0;

  const markComplete = useCallback(async () => {
    if (!currentLesson) return;
    await fetch(`/api/lessons/${currentLesson.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true, courseId }),
    });
    setProgress((prev) => prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id]);
  }, [currentLesson, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!currentLesson) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      강의가 없습니다.
    </div>
  );

  const isCompleted = progress.includes(currentLesson.id);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1.5">
            <ChevronLeft className="w-4 h-4" />
            나가기
          </button>
          <div className="flex-1 mx-6 max-w-sm flex items-center gap-2">
            <ProgressBar value={progressPercent} className="flex-1" />
            <span className="text-xs text-gray-400">{progress.length}/{lessons.length}</span>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              key={currentLesson.id}
              lessonId={currentLesson.id}
              title={currentLesson.title}
            />
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
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isCompleted ? 'bg-green-900/40 text-green-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? '완료됨' : '완료 표시'}
              </button>
            </div>
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
              <button onClick={() => setCurrentLesson(lessons[currentIndex - 1])} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> 이전 강의
              </button>
              <button onClick={() => setCurrentLesson(lessons[currentIndex + 1])} disabled={currentIndex === lessons.length - 1} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed">
                다음 강의 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">강의 목록</h2>
          <ul className="space-y-1">
            {lessons.map((lesson, idx) => (
              <li key={lesson.id}>
                <button
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-colors ${currentLesson.id === lesson.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  {progress.includes(lesson.id) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-gray-500">{idx + 1}</span>
                  )}
                  {lesson.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}