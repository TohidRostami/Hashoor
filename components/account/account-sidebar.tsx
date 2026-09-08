"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const NAV = [
  { label: "داشبورد", href: "/account" },
  { label: "سفارش‌های من", href: "/account/orders" },
  { label: "آدرس‌ها", href: "/account/addresses" },
];

export function AccountSidebar({ name, subtitle }: { name: string; subtitle: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-full max-w-[320px] flex-1 basis-[240px] rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface-sunken text-lg font-black">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-[15px] font-extrabold">{name}</div>
          <div className="mt-1 text-xs text-black">{subtitle}</div>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[11px] px-3.5 py-3 text-sm font-semibold transition-colors hover:bg-surface-sunken",
                active ? "bg-brand/[0.14] text-brand-hover" : "text-ink"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Button
          onClick={async () => {
            await authClient.signOut();
            router.push("/");
            router.refresh();
          }}
          variant="destructive"
        >
          <LogOut className="h-4 w-4" />
          خروج از حساب
        </Button>
      </nav>
    </aside>
  );
}
