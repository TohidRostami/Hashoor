"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  ShoppingBag,
  User,
  BrickWallShield,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/lib/store/cart";
import { useSession } from "@/lib/auth-client";
import type { CategoryDTO } from "@/lib/types";
import { SearchDialog } from "../shop/search-dialog";
import { ShopMobileNav } from "../shop/shop-mobile-nav";

export function SiteHeaderClient({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const cartCount = useCartCount();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-backdrop-blur:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-2 sm:px-6 lg:px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="باز کردن منو"
              className="md:hidden pr-2"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn("w-4/5")}>
            <ShopMobileNav
              onNavigate={() => setOpen(false)}
              role={session?.user?.role as string}
              categories={categories}
            />
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="shrink-0 mr-9 sm:m-0"
          aria-label={siteConfig.site.name}
        >
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="ناوبری اصلی"
        >
          {siteConfig.nav.main.map((item) =>
            item.label === "دسته بندی محصولات" ? (
              <div key={item.href} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  aria-expanded={isCategoryOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      isCategoryOpen && "rotate-180",
                    )}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute start-0 top-full z-50 mt-2 min-w-56 rounded-lg border border-border bg-popover p-2 shadow-md">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          {(session?.user?.role === "ADMIN" ||
            session?.user?.role === "SUBADMIN") && (
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
                <span className=" absolute top-2 right-1 flex size-4 items-center justify-center rounded-full bg-dark-blue text-[10px] text-accent-2-foreground">
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
