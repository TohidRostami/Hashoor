"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function setUserRole(userId: string, role: "ADMIN" | "CUSTOMER") {
  const session = await requireAdmin();

  if (session.user.id === userId && role === "CUSTOMER") {
    return { error: "نمی‌توانید دسترسی ادمین خودتان را حذف کنید." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true as const };
}
