'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  courseId: string;
}

export default function FreeEnrollButton({ courseId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/courses/${courseId}/learn`);
      } else {
        alert(data.error ?? '수강 등록에 실패했습니다.');
        setLoading(false);
      }
    } catch {
      alert('오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="btn-primary w-full justify-center text-base py-4"
    >
      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> 등록 중...</> : '무료로 수강하기'}
    </button>
  );
}