"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const KNOWN_VARIANTS: GarmentVariant[] = [
  "shirts",
  "tshirts",
  "pants",
  "outerwear",
  "shoes",
  "accessories",
];
function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug) ? (slug as GarmentVariant) : "shirts";
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!mounted) {
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="size-10 text-muted-foreground/50" strokeWidth={1.3} />
        <h1 className="mt-6 text-xl font-bold">سبد خرید شما خالی است</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          هنوز محصولی به سبد خریدتان اضافه نکرده‌اید. سری به مجموعه هاشور بزنید.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">سبد خرید</h1>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <ul className="flex-1 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-5">
              <Link
                href={`/products/${item.slug}`}
                className="w-24 shrink-0 overflow-hidden rounded-md border border-border sm:w-28"
              >
                <ProductPlaceholder variant={toGarmentVariant(item.categorySlug)} />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium transition-colors hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="mt-1 text-xs text-muted-foreground">سایز: {item.size}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="حذف از سبد خرید"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                      className="flex size-8 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
                      aria-label="کم کردن تعداد"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="font-nums w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                      className="flex size-8 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
                      aria-label="زیاد کردن تعداد"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="text-sm">
                    <span className="font-nums font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <span className="mr-1 text-xs text-muted-foreground">تومان</span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="w-full shrink-0 rounded-lg border border-border p-6 lg:w-80">
          <h2 className="text-sm font-medium">خلاصه سفارش</h2>

          <div className="mt-5 flex gap-2">
            <Input placeholder="کد تخفیف" className="flex-1" />
            <Button variant="outline">اعمال</Button>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>جمع جزء</span>
              <span>
                <span className="font-nums text-foreground">{formatPrice(subtotal)}</span>
                <span> تومان</span>
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>هزینه ارسال</span>
              <span>در مرحله بعد محاسبه می‌شود</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between border-t border-border pt-5 text-base font-medium">
            <span>مبلغ قابل پرداخت</span>
            <span>
              <span className="font-nums">{formatPrice(subtotal)}</span>
              <span> تومان</span>
            </span>
          </div>

          <Button size="lg" asChild className={cn("mt-6 w-full")}>
            <Link href="/checkout">ادامه فرآیند خرید</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
