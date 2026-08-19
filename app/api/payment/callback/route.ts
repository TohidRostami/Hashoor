import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payment";

/**
 * This is where a real gateway redirects back to (or posts server-to-
 * server) once PAYMENT_GATEWAY_MERCHANT_ID is set and lib/payment/index.ts
 * has a real verifyPayment() implementation — set this exact URL as the
 * "callback" / "redirect" URL in the gateway's dashboard:
 *
 *   {NEXT_PUBLIC_SITE_URL}/api/payment/callback
 *
 * Until then this route isn't reached — checkout uses the local
 * /checkout/payment-simulator instead. Query-param names below
 * (orderId, authority/refId, status) are guesses shaped after common
 * Iranian gateways; adjust to match whichever one is actually connected.
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const orderId = params.orderId ?? params.order_id;

  if (!orderId) {
    return NextResponse.redirect(new URL("/checkout/result", request.url));
  }

  try {
    const result = await verifyPayment(orderId, params);
    const status = result.success ? "success" : "failed";
    return NextResponse.redirect(
      new URL(`/checkout/result?order=${orderId}&status=${status}`, request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/checkout/result?order=${orderId}&status=failed`, request.url)
    );
  }
}
