import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { courseId, orderId, amount } = await request.json();

    if (!courseId || !orderId || !amount) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Verify course exists and price matches
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, price, is_published')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: '강의를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (course.price !== amount) {
      return NextResponse.json({ error: '결제 금액이 올바르지 않습니다.' }, { status: 400 });
    }

    // Check if already enrolled
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (enrollment) {
      return NextResponse.json({ error: '이미 수강 중인 강의입니다.' }, { status: 409 });
    }

    // Create pending order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        course_id: courseId,
        order_id: orderId,
        amount,
        status: 'pending',
      });

    if (orderError) {
      return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
