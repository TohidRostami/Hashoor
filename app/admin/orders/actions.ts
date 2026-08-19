"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { OrderStatus } from "@/lib/generated/prisma";

const VALID_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) return { error: "وضعیت نامعتبر است." };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { success: true as const };
}
