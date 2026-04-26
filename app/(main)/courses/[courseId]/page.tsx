import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDuration } from '@/lib/utils';
import { BookOpen, Clock, BarChart2, CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import FreeEnrollButton from '@/components/FreeEnrollButton';

interface Props {
  params: { courseId: string };
}

export default async function CourseDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.courseId)
    .eq('is_published', true)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_num', { ascending: true });

  const sortedLessons = lessons ?? [];

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle();
    isEnrolled = !!enrollment;
  }

  if (isEnrolled) {
    redirect(`/courses/${course.id}/learn`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">{course.short_description}</p>
            <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                총 {sortedLessons.length}강
              </span>
            </div>
          </div>

          {course.description && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">강의 소개</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {course.description}
              </div>
            </div>
          )}

          {sortedLessons.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">커리큘럼</h2>
              <ul className="space-y-2">
                {sortedLessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-2.5 text-sm text-gray-600 py-1.5">
                    <PlayCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">무료</span>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm">
              {['수강 즉시 가능', '무제한 재수강', `총 ${sortedLessons.length}개 강의`, '모바일/PC 모두 지원'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {user ? (
              <FreeEnrollButton courseId={course.id} />
            ) : (
              <div className="space-y-3">
                <Link href={`/login?redirect=/courses/${course.id}`} className="btn-primary w-full justify-center">
                  로그인하고 수강하기
                </Link>
                <Link href={`/signup?redirect=/courses/${course.id}`} className="btn-secondary w-full justify-center">
                  무료로 가입하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}