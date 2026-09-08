"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getCartItemsStatus, applyDiscountCode } from "./actions";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const updatePrice = useCartStore((s) => s.updatePrice);
  const discountCode = useCartStore((s) => s.discountCode);
  const setDiscountCode = useCartStore((s) => s.setDiscountCode);

  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);

  // Reconciles the cached cart (from localStorage, possibly days old)
  // against the live database exactly once per page load — removing
  // anything no longer available, clamping quantities down to whatever
  // stock actually remains, and syncing any price that's since changed.
  // This runs only on mount, deliberately not whenever `items` changes,
  // since setQuantity/updatePrice below would otherwise re-trigger it.
  useEffect(() => {
    if (!mounted || items.length === 0) return;
    let cancelled = false;

    getCartItemsStatus(items.map((i) => ({ productId: i.productId, variantId: i.variantId }))).then(
      (statuses) => {
        if (cancelled) return;
        const statusByVariant = new Map(statuses.map((s) => [s.variantId, s]));

        for (const item of items) {
          const status = statusByVariant.get(item.variantId);

          if (!status || !status.available) {
            removeItem(item.variantId);
            toast.error(`«${item.name}» دیگر در دسترس نیست و از سبد خرید حذف شد.`);
            continue;
          }

          if (status.stock < item.quantity) {
            if (status.stock <= 0) {
              removeItem(item.variantId);
              toast.error(`موجودی «${item.name}» تمام شده و از سبد خرید حذف شد.`);
            } else {
              setQuantity(item.variantId, status.stock);
              toast.error(
                `موجودی «${item.name}» کاهش یافته — تعداد به ${toPersianDigits(status.stock)} تغییر کرد.`
              );
            }
            continue;
          }

          if (status.price !== item.price) {
            updatePrice(item.variantId, status.price);
            toast(`قیمت «${item.name}» به‌روزرسانی شد.`);
          }
        }
      }
    );

    return () => {
      cancelled = true;
    };
    // Intentionally only [mounted] — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = discountCode
    ? discountCode.type === "PERCENTAGE"
      ? Math.round((subtotal * discountCode.value) / 100)
      : Math.min(discountCode.value, subtotal)
    : 0;
  const payable = subtotal - discountAmount;

  async function handleApplyDiscount() {
    if (!codeInput.trim()) return;
    setApplying(true);
    const result = await applyDiscountCode(codeInput.trim(), subtotal);
    setApplying(false);

    if (!result.valid) {
      toast.error(result.error);
      return;
    }
    setDiscountCode({ id: result.id, code: result.code, type: result.type, value: result.value });
    toast.success(`کد «${result.code}» با موفقیت اعمال شد.`);
    setCodeInput("");
  }

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
                className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border sm:h-28 sm:w-28"
              >
                <Image
                  src={item.image as string}
                  alt={item.name}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 112px, 96px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
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
                    {item.color && (
                      <p className="mt-1 text-xs text-muted-foreground">رنگ: {item.color}</p>
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
                    <span className=" w-8 text-center text-sm">{toPersianDigits(item.quantity)}</span>
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
                    <span className=" font-medium">
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

          {discountCode ? (
            <div className="mt-5 flex items-center justify-between gap-2 rounded-md border border-dashed border-border px-3 py-2.5">
              <span className="text-sm font-medium">
                کد «{discountCode.code}» اعمال شد
              </span>
              <button
                type="button"
                onClick={() => setDiscountCode(null)}
                aria-label="حذف کد تخفیف"
                className="text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                حذف
              </button>
            </div>
          ) : (
            <div className="mt-5 flex gap-2">
              <Input
                placeholder="کد تخفیف"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                disabled={applying}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleApplyDiscount} disabled={applying || !codeInput.trim()}>
                {applying ? "..." : "اعمال"}
              </Button>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>جمع جزء</span>
              <span>
                <span className=" text-foreground">{formatPrice(subtotal)}</span>
                <span> تومان</span>
              </span>
            </div>
            {discountCode && (
              <div className="flex justify-between text-success">
                <span>تخفیف</span>
                <span>−{formatPrice(discountAmount)} تومان</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>هزینه ارسال</span>
              <span>در مرحله بعد محاسبه می‌شود</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between border-t border-border pt-5 text-base font-medium">
            <span>مبلغ قابل پرداخت</span>
            <span>
              <span className="">{formatPrice(payable)}</span>
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
