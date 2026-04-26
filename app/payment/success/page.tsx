'use client';
import { Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
type Status = 'loading' | 'success' | 'error';
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [courseId, setCourseId] = useState('');
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const cid = searchParams.get('courseId');
    if (!paymentKey || !orderId || !amount) {
      setErrorMsg('잘못된 접근입니다.');
      setStatus('error');
      return;
    }
    if (cid) setCourseId(cid);
    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const id = data.courseId ?? cid;
          setCourseId(id);
          setStatus('success');
          setTimeout(() => router.push(`/courses/${id}/learn`), 3000);
        } else {
          setErrorMsg(data.error ?? '결제 처리 중 오류가 발생했습니다.');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrorMsg('네트워크 오류가 발생했습니다.');
        setStatus('error');
      });
  }, []);
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-14 h-14 text-blue-500 animate-spin mx-auto mb-5" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">결제를 처리하고 있습니다</h2>
          <p className="text-gray-500 text-sm">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card p-10 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">결제 처리 실패</h2>
          <p className="text-gray-600 mb-8">{errorMsg}</p>
          <div className="space-y-3">
            {courseId && (
              <Link href={`/courses/${courseId}`} className="btn-primary w-full justify-center">
                강의 페이지로 돌아가기
              </Link>
            )}
            <Link href="/" className="btn-secondary w-full justify-center">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">결제가 완료되었습니다!</h2>
        <p className="text-gray-600 mb-2">
          수강 등록이 완료되었습니다.<br />
          지금 바로 강의를 시작하세요!
        </p>
        <p className="text-sm text-gray-400 mb-8">3초 후 자동으로 이동합니다...</p>
        <Link href={`/courses/${courseId}/learn`} className="btn-primary w-full justify-center text-base py-4">
          수강 시작하기
        </Link>
      </div>
    </div>
  );
}
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-14 h-14 text-blue-500 animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}