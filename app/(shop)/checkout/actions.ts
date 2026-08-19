"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateOrderNumber, initiatePayment } from "@/lib/payment";
import { getSiteSettings } from "@/lib/queries/settings";

export type CheckoutItem = { productId: string; variantId: string; quantity: number };

export type AddressInput = {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
};

export type PlaceOrderResult =
  | { error: string }
  | { redirectUrl: string; orderId: string };

export async function placeOrder(
  items: CheckoutItem[],
  address: AddressInput
): Promise<PlaceOrderResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید." };
  }
  if (items.length === 0) {
    return { error: "سبد خرید خالی است." };
  }

  // Re-price everything from the database — the cart in the browser is
  // just a display convenience and is never trusted for money math.
  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    variantId: string | null;
    name: string;
    size: string | null;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = (await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: { include: { size: true } } },
    })) as {
      id: string;
      name: string;
      price: number;
      isPublished: boolean;
      variants: { id: string; size: { name: string } | null }[];
    } | null;

    if (!product || !product.isPublished) {
      return { error: "یکی از محصولات سبد خرید دیگر در دسترس نیست." };
    }

    const variant = product.variants.find((v) => v.id === item.variantId);

    subtotal += product.price * item.quantity;
    orderItemsData.push({
      productId: item.productId,
      variantId: item.variantId || null,
      name: product.name,
      size: variant?.size?.name ?? null,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const settings = await getSiteSettings();
  const freeShippingMet =
    settings.freeShippingThreshold != null && subtotal >= settings.freeShippingThreshold;
  const shippingCost = freeShippingMet ? 0 : settings.standardShippingCost;
  const total = subtotal + shippingCost;

  const createdAddress = (await prisma.address.create({
    data: { ...address, userId: session.user.id },
  })) as { id: string };

  const order = (await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      addressId: createdAddress.id,
      subtotal,
      shippingCost,
      total,
    },
  })) as { id: string; orderNumber: string };

  for (const item of orderItemsData) {
    await prisma.orderItem.create({ data: { orderId: order.id, ...item } });
  }

  const payment = await initiatePayment({
    id: order.id,
    orderNumber: order.orderNumber,
    total,
  });

  return { redirectUrl: payment.redirectUrl, orderId: order.id };
}

/**
 * Stands in for a real gateway's callback while none is connected yet —
 * lets the full order → pay → result flow be tested today. Once a real
 * gateway is wired (see lib/payment/index.ts), this simulator route and
 * this action are no longer used; /api/payment/callback takes over.
 */
export async function completeSimulatedPayment(
  orderId: string,
  outcome: "success" | "fail"
): Promise<string> {
  if (outcome === "success") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paidAt: new Date(), gatewayRef: `SIM-${Date.now()}` },
    });
    return `/checkout/result?order=${orderId}&status=success`;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
  return `/checkout/result?order=${orderId}&status=failed`;
}
