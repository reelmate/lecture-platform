'use client';

import { CheckCircle2, Circle, Lock, PlayCircle } from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import type { Section, Lesson, LessonProgress } from '@/types';

interface Props {
  sections: (Section & { lessons: Lesson[] })[];
  currentLessonId: string;
  progress: LessonProgress[];
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonSidebar({ sections, currentLessonId, progress, onSelectLesson }: Props) {
  const progressMap = new Map(progress.map((p) => [p.lesson_id, p]));

  return (
    <aside className="w-full lg:w-80 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-900 text-sm">강의 커리큘럼</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {sections.reduce((acc, s) => acc + s.lessons.length, 0)}개 강의
        </p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="px-5 py-3 bg-gray-50 sticky top-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {section.title}
              </p>
            </div>
            {section.lessons.map((lesson) => {
              const p = progressMap.get(lesson.id);
              const isActive = lesson.id === currentLessonId;
              const isCompleted = p?.completed ?? false;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className={cn(
                    'w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-blue-50 transition-colors',
                    isActive && 'bg-blue-50 border-l-2 border-blue-500'
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : isActive ? (
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium leading-tight',
                      isActive ? 'text-blue-600' : 'text-gray-700'
                    )}>
                      {lesson.title}
                    </p>
                    {lesson.duration && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDuration(lesson.duration)}
                      </p>
                    )}
                  </div>
                  {lesson.is_preview && !isActive && (
                    <span className="text-xs text-blue-500 font-medium flex-shrink-0">미리보기</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
