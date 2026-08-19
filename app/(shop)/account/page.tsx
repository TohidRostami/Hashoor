import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";

import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/shop/logout-button";

export const metadata: Metadata = { title: "حساب کاربری" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account");

  const { user } = session;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">حساب کاربری</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.name}</p>
          <p className="font-nums text-sm text-muted-foreground" dir="ltr">
            {user.email.endsWith("@hashor-phone.local") ? "" : user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-sm font-medium">سفارش‌های من</h2>
        <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border py-16 text-center">
          <PackageOpen className="size-8 text-muted-foreground/50" strokeWidth={1.3} />
          <p className="mt-4 text-sm text-muted-foreground">هنوز سفارشی ثبت نکرده‌اید.</p>
        </div>
      </div>
    </div>
  );
}
