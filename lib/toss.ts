const TOSS_API_URL = 'https://api.tosspayments.com/v1';

function getAuthHeader() {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encoded = Buffer.from(`${secretKey}:`).toString('base64');
  return `Basic ${encoded}`;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const response = await fetch(`${TOSS_API_URL}/payments/confirm`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '결제 승인에 실패했습니다.');
  }

  return data;
}

export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
) {
  const body: Record<string, unknown> = { cancelReason };
  if (cancelAmount !== undefined) body.cancelAmount = cancelAmount;

  const response = await fetch(`${TOSS_API_URL}/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '결제 취소에 실패했습니다.');
  }

  return data;
}
