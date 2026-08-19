export type PaymentInitResult = { redirectUrl: string };
export type PaymentVerifyResult = { success: boolean; refId?: string; message?: string };

/**
 * The one seam to touch when the real payment gateway link is ready.
 *
 * Until PAYMENT_GATEWAY_MERCHANT_ID is set, checkout redirects to a local
 * simulated gateway (/checkout/payment-simulator/[orderId]) so the full
 * pre-payment flow and the result page can be built and tested end to
 * end today. Swapping in a real Iranian gateway (ZarinPal, Zibal, IDPay,
 * ...) only means filling in the two functions below — nothing in the
 * cart, checkout form, or result page needs to change.
 */
export async function initiatePayment(order: {
  id: string;
  orderNumber: string;
  total: number;
}): Promise<PaymentInitResult> {
  const merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;

  if (!merchantId) {
    return { redirectUrl: `/checkout/payment-simulator/${order.id}` };
  }

  // Replace with the real gateway's "payment request" call. Example shape
  // for ZarinPal (https://www.zarinpal.com/docs/paymentGateway/):
  //
  //   const res = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       merchant_id: merchantId,
  //       amount: order.total * 10, // toman → rial
  //       callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
  //       description: `سفارش ${order.orderNumber}`,
  //     }),
  //   });
  //   const data = await res.json();
  //   return { redirectUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}` };

  throw new Error(
    "PAYMENT_GATEWAY_MERCHANT_ID تنظیم شده ولی اتصال واقعی درگاه هنوز در lib/payment/index.ts پیاده‌سازی نشده."
  );
}

/** Called from /api/payment/callback once the real gateway redirects back. */
export async function verifyPayment(
  _orderId: string,
  _callbackParams: Record<string, string>
): Promise<PaymentVerifyResult> {
  throw new Error("verifyPayment() هنوز پیاده‌سازی نشده — بعد از وصل کردن درگاه واقعی تکمیلش کنید.");
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HSH-${y}${m}${d}-${rand}`;
}
