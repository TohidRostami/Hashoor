import { prisma } from "@/lib/db";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: "CUSTOMER" | "ADMIN" | "SUBADMIN";
  createdAt: string | Date;
};

export async function getAllUsers(): Promise<AdminUserRow[]> {
  const users = (await prisma.user.findMany({})) as unknown as AdminUserRow[];
  return users.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
