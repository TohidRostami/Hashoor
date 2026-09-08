import { prisma } from "@/lib/db";

export type CustomerOrderItemDTO = {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
};

export type CustomerOrderDTO = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string | Date;
  items: CustomerOrderItemDTO[];
};

/**
 * A customer's own order history, most recent first, each with its
 * line items. `userId` must come from a verified session (see usage
 * example) — this function itself does no auth check, so it must never
 * be called with a user-supplied id.
 */
export async function getOrdersForCustomer(userId: string): Promise<CustomerOrderDTO[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders as unknown as CustomerOrderDTO[];
}

export type CustomerOrderDetailItemDTO = {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  productSlug: string | null;
  /** The image for the specific color/variant that was ordered, when
   * available; falls back to the product's first image otherwise (e.g.
   * for older orders placed before the color feature existed). */
  image: string | null;
};

export type CustomerOrderDetailDTO = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  gatewayRef: string | null;
  paidAt: string | Date | null;
  createdAt: string | Date;
  address: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
  };
  discountCode: { code: string } | null;
  items: CustomerOrderDetailItemDTO[];
};

/**
 * Full detail for one order — address, discount, payment reference, and
 * every item with a representative image.
 *
 * Security-critical: `id` and `userId` are combined in the *same* where
 * clause (via findFirst, since `id + userId` isn't a declared unique
 * constraint so findUnique can't be used for it) — this means the query
 * itself returns null for an order that exists but belongs to someone
 * else, rather than fetching it and checking ownership as a second
 * step. Never split this into "fetch by id, then check order.userId"
 * — that pattern is easy to accidentally get wrong or forget entirely
 * on a future edit, and the query-level check can't be skipped.
 */
export async function getOrderForCustomer(
  orderId: string,
  userId: string
): Promise<CustomerOrderDetailDTO | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      address: true,
      discountCode: { select: { code: true } },
      items: {
        include: {
          product: { select: { slug: true, images: { take: 1, orderBy: { sortOrder: "asc" } } } },
          variant: {
            include: {
              color: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  const raw = order as unknown as {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    total: number;
    gatewayRef: string | null;
    paidAt: string | Date | null;
    createdAt: string | Date;
    address: CustomerOrderDetailDTO["address"];
    discountCode: { code: string } | null;
    items: {
      id: string;
      name: string;
      size: string | null;
      color: string | null;
      price: number;
      quantity: number;
      product: { slug: string; images: { url: string }[] } | null;
      variant: { color: { images: { url: string }[] } | null } | null;
    }[];
  };

  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: raw.status,
    subtotal: raw.subtotal,
    discountAmount: raw.discountAmount,
    shippingCost: raw.shippingCost,
    total: raw.total,
    gatewayRef: raw.gatewayRef,
    paidAt: raw.paidAt,
    createdAt: raw.createdAt,
    address: raw.address,
    discountCode: raw.discountCode,
    items: raw.items.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
      productSlug: item.product?.slug ?? null,
      image: item.variant?.color?.images[0]?.url ?? item.product?.images[0]?.url ?? null,
    })),
  };
}