'use client';
import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, type PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { generateOrderId } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { Loader2, ShieldCheck } from 'lucide-react';
interface Props {
  courseId: string;
  courseTitle: string;
  amount: number;
  userId: string;
  userEmail: string;
}
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
const SUCCESS_URL = process.env.NEXT_PUBLIC_APP_URL + '/payment/success';
const FAIL_URL = process.env.NEXT_PUBLIC_APP_URL + '/payment/fail';
export default function PaymentWidget({ courseId, courseTitle, amount, userId, userEmail }: Props) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const orderId = useRef(generateOrderId(courseId));
  useEffect(() => {
    async function initWidget() {
      try {
        const widget = await loadPaymentWidget(CLIENT_KEY, userId);
        paymentWidgetRef.current = widget;
        await widget.renderPaymentMethods('#payment-method', { value: amount });
        await widget.renderAgreement('#payment-agreement');
        setReady(true);
      } catch (e) {
        console.error('결제 위젯 초기화 실패:', e);
      } finally {
        setLoading(false);
      }
    }
    initWidget();
  }, [amount, userId]);
  const handlePayment = async () => {
    if (!paymentWidgetRef.current || !ready) {
      alert('결제 위젯이 아직 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setPaying(true);
    try {
      const prepareRes = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, orderId: orderId.current, amount }),
      });
      if (!prepareRes.ok) {
        const err = await prepareRes.json();
        alert(err.error ?? '주문 생성에 실패했습니다.');
        setPaying(false);
        return;
      }
      await paymentWidgetRef.current.requestPayment({
        orderId: orderId.current,
        orderName: courseTitle,
        customerEmail: userEmail,
        successUrl: `${SUCCESS_URL}?courseId=${courseId}`,
        failUrl: `${FAIL_URL}?courseId=${courseId}`,
      });
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err?.code !== 'USER_CANCEL') {
        alert(err?.message ?? '결제 중 오류가 발생했습니다.');
      }
      setPaying(false);
    }
  };
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
      <div id="payment-method" className={loading ? 'hidden' : ''} />
      <div id="payment-agreement" className={loading ? 'hidden' : ''} />
      {!loading && (
        <button
          onClick={handlePayment}
          disabled={paying || !ready}
          className="btn-primary w-full text-base py-4 gap-2"
        >
          {paying ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> 결제 처리 중...</>
          ) : (
            <><ShieldCheck className="w-5 h-5" /> {formatPrice(amount)} 결제하기</>
          )}
        </button>
      )}
      <p className="text-center text-xs text-gray-400">
        결제 완료 즉시 수강이 가능합니다 · 토스페이먼츠 보안 결제
      </p>
    </div>
  );
}