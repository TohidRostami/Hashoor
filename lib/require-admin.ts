import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/admin");

  const role = (session.user as unknown as { role?: string }).role;
  if (role !== "ADMIN") redirect("/");

  return session;
}
