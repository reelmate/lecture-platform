import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { courseId } = await req.json();

  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: user.id, course_id: courseId });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: '수강 등록에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}