import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { completed, progressSeconds } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', params.lessonId)
      .single();

    if (!lesson) {
      return NextResponse.json({ error: '강의를 찾을 수 없습니다.' }, { status: 404 });
    }

    await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: params.lessonId,
        course_id: lesson.course_id,
        completed: completed ?? false,
        progress_seconds: progressSeconds ?? 0,
        last_watched_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
