'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.';
  const code = searchParams.get('code');
  const courseId = searchParams.get('courseId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">결제에 실패했습니다</h2>
        <p className="text-gray-600 mb-2">{message}</p>
        {code && <p className="text-xs text-gray-400 mb-8">오류 코드: {code}</p>}
        <div className="space-y-3">
          {courseId && (
            <Link href={`/courses/${courseId}`} className="btn-primary w-full justify-center">
              다시 시도하기
            </Link>
          )}
          <Link href="/" className="btn-secondary w-full justify-center">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
