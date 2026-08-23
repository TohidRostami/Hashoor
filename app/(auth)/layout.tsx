import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { SiteHeader } from "@/components/layout/header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
        <Link href="/" className="mb-9" aria-label="بازگشت به صفحه اصلی">
          <Logo />
        </Link>
        <div className="w-full max-w-sm rounded-lg border border-border p-7 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
