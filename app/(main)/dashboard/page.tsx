import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';
import ProgressBar from '@/components/ProgressBar';
import { BookOpen, Play } from 'lucide-react';
import type { Course, Enrollment, LessonProgress } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/dashboard');

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false });

  const courseIds = (enrollments ?? []).map((e: Enrollment & { courses: Course }) => e.courses.id);

  let progressByCoure: Record<string, { completed: number; total: number }> = {};

  if (courseIds.length > 0) {
    const { data: allProgress } = await supabase
      .from('lesson_progress')
      .select('course_id, completed')
      .eq('user_id', user.id)
      .in('course_id', courseIds);

    const { data: allLessons } = await supabase
      .from('lessons')
      .select('course_id')
      .in('course_id', courseIds);

    for (const courseId of courseIds) {
      const total = (allLessons ?? []).filter((l) => l.course_id === courseId).length;
      const completed = (allProgress ?? []).filter(
        (p: { course_id: string; completed: boolean }) => p.course_id === courseId && p.completed
      ).length;
      progressByCoure[courseId] = { completed, total };
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          안녕하세요, {profile?.full_name ?? '수강생'}님!
        </h1>
        <p className="text-gray-500 mt-2">
          {enrollments?.length ? `${enrollments.length}개의 강의를 수강 중입니다.` : '아직 수강 중인 강의가 없습니다.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">수강 중인 강의</p>
          <p className="text-3xl font-bold text-blue-600">{enrollments?.length ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">완료한 레슨</p>
          <p className="text-3xl font-bold text-green-600">
            {Object.values(progressByCoure).reduce((acc, p) => acc + p.completed, 0)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">전체 진행률</p>
          <p className="text-3xl font-bold text-purple-600">
            {enrollments?.length
              ? Math.round(
                  (Object.values(progressByCoure).reduce((acc, p) => acc + p.completed, 0) /
                    Math.max(Object.values(progressByCoure).reduce((acc, p) => acc + p.total, 0), 1)) * 100
                )
              : 0}%
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      {enrollments && enrollments.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">내 강의</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: Enrollment & { courses: Course }) => {
              const course = enrollment.courses;
              const p = progressByCoure[course.id] ?? { completed: 0, total: 0 };
              const percent = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;

              return (
                <div key={enrollment.id} className="card overflow-hidden">
                  <CourseCard course={course} enrolled />
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{p.completed}/{p.total} 강의 완료</span>
                      <span>{percent}%</span>
                    </div>
                    <ProgressBar value={percent} />
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="btn-primary w-full mt-4 text-sm py-2.5 gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {percent > 0 ? '이어서 수강하기' : '수강 시작하기'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">아직 수강 중인 강의가 없어요</h3>
          <p className="text-gray-500 mb-6">마음에 드는 강의를 찾아 시작해보세요!</p>
          <Link href="/" className="btn-primary">강의 둘러보기</Link>
        </div>
      )}
    </div>
  );
}
