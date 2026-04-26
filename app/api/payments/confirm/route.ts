import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { confirmPayment } from '@/lib/toss';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Verify order belongs to user and is pending
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: '유효하지 않은 주문입니다.' }, { status: 400 });
    }

    if (order.amount !== amount) {
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다.' }, { status: 400 });
    }

    // Confirm payment with Toss API
    const tossData = await confirmPayment(paymentKey, orderId, amount);

    // Use service client to bypass RLS for enrollment creation
    const serviceSupabase = await createServiceClient();

    // Update order status
    await serviceSupabase
      .from('orders')
      .update({
        payment_key: paymentKey,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    // Create enrollment immediately — instant access
    const { error: enrollError } = await serviceSupabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: order.course_id,
        order_id: order.id,
      });

    if (enrollError) {
      // Enrollment failed — try to cancel payment
      console.error('Enrollment creation failed:', enrollError);
      return NextResponse.json({ error: '수강 등록에 실패했습니다. 고객센터로 문의해주세요.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      courseId: order.course_id,
      paymentMethod: tossData.method,
    });
  } catch (e: unknown) {
    const err = e as Error;
    console.error('Payment confirm error:', err.message);
    return NextResponse.json({ error: err.message || '결제 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
