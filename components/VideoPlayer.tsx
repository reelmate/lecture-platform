'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  lessonId: string;
  title: string;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({ lessonId, title, onProgress, onComplete }: Props) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/lessons/${lessonId}/token`)
      .then((r) => r.json())
      .then((data) => {
        if (data.embedUrl) {
          setEmbedUrl(data.embedUrl);
        } else {
          setError('영상을 불러올 수 없습니다.');
        }
      })
      .catch(() => setError('영상을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [lessonId]);

  if (loading) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-xl">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (error || !embedUrl) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-xl">
        <p className="text-white text-sm">{error ?? '영상을 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
