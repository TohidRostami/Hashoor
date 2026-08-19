import { prisma } from "@/lib/db";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  userId: string;
  createdAt: string | Date;
};
type UserRow = { id: string; name: string; email: string };

const PAID_STATUSES = new Set(["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]);

export async function getDashboardStats() {
  const [orders, productCount, customerCount] = await Promise.all([
    prisma.order.findMany({}) as unknown as Promise<OrderRow[]>,
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const paidOrders = orders.filter((o) => PAID_STATUSES.has(o.status));
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const statusCounts: Record<string, number> = {};
  for (const o of orders) statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;

  return {
    revenue,
    orderCount: orders.length,
    paidOrderCount: paidOrders.length,
    productCount,
    customerCount,
    statusCounts,
  };
}

export async function getRecentOrders(take = 8) {
  const [orders, users] = await Promise.all([
    prisma.order.findMany({}) as unknown as Promise<OrderRow[]>,
    prisma.user.findMany({}) as unknown as Promise<UserRow[]>,
  ]);

  const userById = new Map(users.map((u) => [u.id, u]));

  return orders
    .map((o) => ({ ...o, customer: userById.get(o.userId) ?? null }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, take);
}
