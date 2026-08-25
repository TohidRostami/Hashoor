"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  House,
  ShoppingCart,
  Info,
  Phone,
  User,
  BrickWallShield,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

const NAV = [
  { href: "/", label: "خانه", icon: House, exact: true },
  { href: "/products", label: "محصولات", icon: Package },
  { href: "/cart", label: "سبد خرید", icon: ShoppingCart },
  { href: "/contact", label: "تماس با ما", icon: Phone },
  { href: "/about", label: "درباره ما", icon: Info },
];

export function ShopMobileNav({
  onNavigate,
  role,
}: {
  onNavigate?: () => void;
  role: string;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full flex-col text-sidebar-foreground px-2">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="[&_span]:text-sidebar-foreground">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-black hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.6} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        {role === "ADMIN" && role !== undefined ? (
          <div className="flex flex-col gap-2">
            <Link
              onClick={onNavigate}
              href="/account"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white transition-colors bg-dark-blue"
            >
              <User className="size-4" strokeWidth={1.6} />
              ورود به حساب کاربری
            </Link>
            <Link
              onClick={onNavigate}
              href="/admin"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white transition-colors bg-dark-blue"
            >
              <BrickWallShield className="size-4" strokeWidth={1.6} />
              ورود به پنل ادمین
            </Link>
          </div>
        ) : (
          <Link
            onClick={onNavigate}
            href={!role ? "/login" : "/account"}
            // href="/login"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white transition-colors bg-dark-blue"
          >
            <User className="size-4" strokeWidth={1.6} />
            ورود به حساب کاربری
          </Link>
        )}
      </div>
    </div>
  );
}
