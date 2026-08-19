import { prisma } from "@/lib/db";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  userId: string;
  addressId: string;
  createdAt: string | Date;
};
type UserRow = { id: string; name: string; email: string };
type AddressRow = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
};
type OrderItemRow = {
  id: string;
  orderId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
};

export async function getAllOrdersForAdmin() {
  const [orders, users] = await Promise.all([
    prisma.order.findMany({}) as unknown as Promise<OrderRow[]>,
    prisma.user.findMany({}) as unknown as Promise<UserRow[]>,
  ]);
  const userById = new Map(users.map((u) => [u.id, u]));

  return orders
    .map((o) => ({ ...o, customer: userById.get(o.userId) ?? null }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderForAdmin(id: string) {
  const order = (await prisma.order.findUnique({ where: { id } })) as OrderRow | null;
  if (!order) return null;

  const [users, addresses, items] = await Promise.all([
    prisma.user.findMany({}) as unknown as Promise<UserRow[]>,
    prisma.address.findMany({}) as unknown as Promise<AddressRow[]>,
    prisma.orderItem.findMany({ where: { orderId: id } }) as unknown as Promise<OrderItemRow[]>,
  ]);

  return {
    ...order,
    customer: users.find((u) => u.id === order.userId) ?? null,
    address: addresses.find((a) => a.id === order.addressId) ?? null,
    items,
  };
}
