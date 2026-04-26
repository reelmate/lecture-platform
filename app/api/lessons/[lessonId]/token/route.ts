import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSignedBunnyEmbedUrl } from '@/lib/bunny';

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Fetch lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, course_id, bunny_video_id, is_preview')
      .eq('id', params.lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: '강의를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (!lesson.bunny_video_id) {
      return NextResponse.json({ error: '영상이 등록되지 않은 강의입니다.' }, { status: 404 });
    }

    // Preview lessons are accessible without enrollment
    if (!lesson.is_preview) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', lesson.course_id)
        .maybeSingle();

      if (!enrollment) {
        return NextResponse.json({ error: '수강 권한이 없습니다.' }, { status: 403 });
      }
    }

    const userIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    const embedUrl = getSignedBunnyEmbedUrl(lesson.bunny_video_id, userIp);

    return NextResponse.json({ embedUrl });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
