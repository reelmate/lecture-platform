import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';
import type { Course } from '@/types';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
            자영업자, 소상공인,<br />
            1인기업 대표님들의<br />
            브랜딩 콘텐츠를 만들고<br />
            교육합니다
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            영상 제작 업계 23년차 제작자이자 강사가 만든 강의로 빠르게 성장하세요.<br />
            결제 완료 즉시 수강이 가능합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#courses" className="text-sm py-2 px-4 rounded-lg font-semibold transition-colors" style={{ backgroundColor: '#F5E642', color: '#3D1F00' }}>
              강의 둘러보기
            </Link>
            <Link href="/signup" className="text-sm py-2 px-4 rounded-lg font-semibold transition-colors" style={{ backgroundColor: '#F5E642', color: '#3D1F00' }}>
              지금 시작하기
            </Link>
          </div>

          <div className="flex justify-center gap-10 mt-14 text-gray-500">
            <div className="flex flex-col items-center gap-1">
              <BookOpen className="w-7 h-7 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">50+</span>
              <span className="text-sm">강의</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-7 h-7 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">500+</span>
              <span className="text-sm">수강생</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Award className="w-7 h-7 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">5.0★</span>
              <span className="text-sm">평균 평점</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course List */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">전체 강의</h2>
            <p className="text-gray-500 text-sm mt-1">{courses?.length ?? 0}개의 강의</p>
          </div>
        </div>

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>아직 등록된 강의가 없습니다.</p>
          </div>
        )}
      </section>
    </>
  );
}
