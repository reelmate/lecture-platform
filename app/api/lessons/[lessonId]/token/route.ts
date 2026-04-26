import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, course_id, video_url')
      .eq('id', params.lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: '강의를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (!lesson.video_url) {
      return NextResponse.json({ error: '영상이 등록되지 않은 강의입니다.' }, { status: 404 });
    }

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', lesson.course_id)
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json({ error: '수강 권한이 없습니다.' }, { status: 403 });
    }

    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${lesson.video_url}?autoplay=false`;

    return NextResponse.json({ embedUrl });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}