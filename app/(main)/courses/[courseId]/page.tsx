import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PaymentWidget from '@/components/PaymentWidget';
import { formatPrice, formatDuration, discountPercent } from '@/lib/utils';
import { BookOpen, Clock, BarChart2, CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import type { CourseWithSections } from '@/types';

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

  // Fetch sections + lessons
  const { data: sections } = await supabase
    .from('sections')
    .select('*, lessons(*)')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  const sortedSections = (sections ?? []).map((s) => ({
    ...s,
    lessons: [...(s.lessons ?? [])].sort((a, b) => a.order_index - b.order_index),
  }));

  // Check enrollment
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

  const discount = course.original_price
    ? discountPercent(course.price, course.original_price)
    : 0;

  const totalLessons = sortedSections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Course Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {course.category && (
                <span className="badge bg-blue-50 text-blue-600">{course.category}</span>
              )}
              {course.level && (
                <span className="badge bg-gray-100 text-gray-600">
                  <BarChart2 className="w-3 h-3 mr-1" />
                  {({ beginner: '입문', intermediate: '중급', advanced: '고급' } as Record<string, string>)[course.level] ?? course.level}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">{course.short_description}</p>

            <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                총 {totalLessons}강
              </span>
              {course.total_duration > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {formatDuration(course.total_duration * 60)}
                </span>
              )}
              {course.instructor_name && (
                <span className="font-medium text-gray-700">강사: {course.instructor_name}</span>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          {course.thumbnail_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
              <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">강의 소개</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {course.description}
              </div>
            </div>
          )}

          {/* Curriculum */}
          {sortedSections.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">커리큘럼</h2>
              <div className="space-y-4">
                {sortedSections.map((section) => (
                  <div key={section.id}>
                    <h3 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {section.order_index}
                      </span>
                      {section.title}
                    </h3>
                    <ul className="space-y-1 pl-7">
                      {section.lessons.map((lesson: import('@/types').Lesson) => (
                        <li key={lesson.id} className="flex items-center gap-2.5 text-sm text-gray-600 py-1.5">
                          {lesson.is_preview ? (
                            <PlayCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span>{lesson.title}</span>
                          {lesson.is_preview && (
                            <span className="text-xs text-blue-500 font-medium">무료 미리보기</span>
                          )}
                          {lesson.duration && (
                            <span className="ml-auto text-xs text-gray-400">
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatPrice(course.price)}
                </span>
                {course.original_price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(course.original_price)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="badge bg-red-100 text-red-600 mt-1">
                  {discount}% 할인
                </span>
              )}
            </div>

            {/* Benefits */}
            <ul className="space-y-2.5 mb-6 text-sm">
              {[
                '결제 즉시 수강 가능',
                '무제한 재수강',
                `총 ${totalLessons}개 강의`,
                '모바일/PC 모두 지원',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {user ? (
              <PaymentWidget
                courseId={course.id}
                courseTitle={course.title}
                amount={course.price}
                userId={user.id}
                userEmail={user.email ?? ''}
              />
            ) : (
              <div className="space-y-3">
                <Link
                  href={`/login?redirect=/courses/${course.id}`}
                  className="btn-primary w-full justify-center"
                >
                  로그인하고 수강하기
                </Link>
                <Link
                  href={`/signup?redirect=/courses/${course.id}`}
                  className="btn-secondary w-full justify-center"
                >
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
