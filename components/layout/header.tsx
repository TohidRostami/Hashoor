"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, User, BrickWallShield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/lib/store/cart";
import { useSession } from "@/lib/auth-client";
import { SearchDialog } from "../shop/search-dialog";
import { ShopMobileNav } from "../shop/shop-mobile-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const { data: session } = useSession();

  // Cart is persisted to localStorage; read it only after mount so SSR
  // output and first client render always match (avoids a hydration
  // warning), then let the real count take over.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-backdrop-blur:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 sm:px-6 lg:px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="باز کردن منو"
              className="md:hidden"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn("w-4/5")}>
            <ShopMobileNav
              onNavigate={() => setOpen(false)}
              role={session?.user?.role as string}
            />
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0 mr-9 sm:m-0" aria-label={siteConfig.site.name}>
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="ناوبری اصلی"
        >
          {siteConfig.nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          {session?.user?.role === "ADMIN" && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={siteConfig.ui.account}
              asChild
              className="hidden sm:flex"
            >
              <Link href={"/admin"}>
                <BrickWallShield />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={siteConfig.ui.account}
            asChild
            className="hidden sm:flex"
          >
            <Link href={mounted && session ? "/account" : "/login"}>
              <User />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={siteConfig.ui.cart}
            asChild
            className="flex"
          >
            <Link href="/cart" className="relative">
              <ShoppingBag />
              {mounted && cartCount > 0 && (
                <span className="font-gowun-batang absolute top-2 right-1 flex size-4 items-center justify-center rounded-full bg-dark-blue text-[10px] text-accent-2-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
