import { prisma } from "@/lib/db";

export async function listAddressesForUser(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAddressById(id: string, userId: string) {
  return prisma.address.findFirst({ where: { id, userId } });
}
