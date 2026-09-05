"use client";

import { useState } from "react";
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
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/types";

const NAV_BEFORE_CATEGORIES = [
  { href: "/", label: "خانه", icon: House, exact: true },
  { href: "/products", label: "محصولات", icon: Package },
];

const NAV_AFTER_CATEGORIES = [
  { href: "/cart", label: "سبد خرید", icon: ShoppingCart },
  { href: "/contact", label: "تماس با ما", icon: Phone },
  { href: "/about", label: "درباره ما", icon: Info },
];

export function ShopMobileNav({
  onNavigate,
  role,
  categories,
}: {
  onNavigate?: () => void;
  role: string;
  categories: CategoryDTO[];
}) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  function renderNavLink(item: (typeof NAV_BEFORE_CATEGORIES)[number]) {
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
  }

  return (
   <div className="flex h-full min-h-0 flex-col px-2 text-sidebar-foreground">
  {/* Header - stays fixed */}
  <div className="flex shrink-0 items-center justify-between px-5 py-5">
    <Link href="/admin" className="[&_span]:text-sidebar-foreground">
      <Logo />
    </Link>
  </div>

  {/* Scrollable navigation */}
  <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
    <div className="flex flex-col gap-0.5">
      {NAV_BEFORE_CATEGORIES.map(renderNavLink)}

      <button
        type="button"
        onClick={() => setCategoriesOpen((v) => !v)}
        aria-expanded={categoriesOpen}
        className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm text-black transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      >
        <LayoutGrid className="size-4" strokeWidth={1.6} />

        دسته‌بندی محصولات

        <ChevronDown
          className={cn(
            "mr-auto size-4 transition-transform duration-200",
            categoriesOpen && "rotate-180",
          )}
          strokeWidth={1.6}
        />
      </button>

      {categoriesOpen && (
        <div className="flex flex-col gap-0.5 py-1 ps-7">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              onClick={onNavigate}
              className="rounded-md px-3 py-2 text-sm text-black/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {NAV_AFTER_CATEGORIES.map(renderNavLink)}
    </div>
  </nav>

  {/* Bottom actions - stays fixed */}
  <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
    {role === "ADMIN" || role === "SUBADMIN" ? (
      <div className="flex flex-col gap-2">
        <Link
          onClick={onNavigate}
          href="/account"
          className="flex items-center gap-3 rounded-md bg-dark-blue px-3 py-2.5 text-sm text-white transition-colors"
        >
          <User className="size-4" strokeWidth={1.6} />
          ورود به حساب کاربری
        </Link>

        <Link
          onClick={onNavigate}
          href="/admin"
          className="flex items-center gap-3 rounded-md bg-dark-blue px-3 py-2.5 text-sm text-white transition-colors"
        >
          <BrickWallShield className="size-4" strokeWidth={1.6} />
          ورود به پنل ادمین
        </Link>
      </div>
    ) : (
      <Link
        onClick={onNavigate}
        href={!role ? "/login" : "/account"}
        className="flex items-center gap-3 rounded-md bg-dark-blue px-3 py-2.5 text-sm text-white transition-colors"
      >
        <User className="size-4" strokeWidth={1.6} />
        ورود به حساب کاربری
      </Link>
    )}
  </div>
</div>
  );
}
