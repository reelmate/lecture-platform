import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, BarChart2 } from 'lucide-react';
import { formatPrice, formatDuration, discountPercent } from '@/lib/utils';
import type { Course } from '@/types';

const levelLabel: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
};

const levelColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

interface Props {
  course: Course;
  enrolled?: boolean;
}

export default function CourseCard({ course, enrolled = false }: Props) {
  const discount = course.original_price
    ? discountPercent(course.price, course.original_price)
    : 0;

  return (
    <Link href={enrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}>
      <div className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 badge bg-red-500 text-white">
              {discount}% 할인
            </span>
          )}
          {enrolled && (
            <span className="absolute top-3 right-3 badge bg-blue-600 text-white">
              수강 중
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            {course.level && (
              <span className={`badge ${levelColor[course.level] ?? 'bg-gray-100 text-gray-600'}`}>
                <BarChart2 className="w-3 h-3 mr-1" />
                {levelLabel[course.level] ?? course.level}
              </span>
            )}
            {course.category && (
              <span className="badge bg-blue-50 text-blue-600">{course.category}</span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {course.short_description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{course.short_description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {course.total_lessons}강
            </span>
            {course.total_duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(course.total_duration * 60)}
              </span>
            )}
            {course.instructor_name && (
              <span className="truncate">{course.instructor_name}</span>
            )}
          </div>

          {!enrolled && (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</span>
              {course.original_price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(course.original_price)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
