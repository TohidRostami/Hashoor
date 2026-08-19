import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/settings";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = { title: "ثبت‌نام" };

export default async function RegisterPage() {
  const settings = await getSiteSettings();

  if (!settings.emailLoginEnabled) {
    return (
      <div className="text-center">
        <h1 className="mb-3 text-xl font-bold">ثبت‌نام با ایمیل غیرفعال است</h1>
        <p className="text-sm text-muted-foreground">
          می‌توانید از{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            ورود با شماره موبایل
          </Link>{" "}
          استفاده کنید؛ حساب شما خودکار ساخته می‌شود.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-center text-xl font-bold">ساخت حساب کاربری</h1>
      <RegisterClient />
    </>
  );
}
