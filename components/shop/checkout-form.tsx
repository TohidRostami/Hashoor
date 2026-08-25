"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { placeOrder } from "@/app/(shop)/checkout/actions";

export function CheckoutForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string;
  defaultPhone: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: defaultName,
    phone: defaultPhone,
    province: "",
    city: "",
    addressLine: "",
    postalCode: "",
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await placeOrder(
      items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      form
    );

    if ("error" in result) {
      setLoading(false);
      setError(result.error);
      return;
    }

    useCartStore.getState().clear();
    window.location.href = result.redirectUrl;
  }

  if (mounted && items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted-foreground">سبد خرید شما خالی است.</p>
        <Button asChild className="mt-6">
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      <div className="flex flex-col gap-5 lg:col-span-3">
        <h2 className="text-sm font-medium">آدرس تحویل</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="نام و نام‌خانوادگی گیرنده"
            value={form.fullName}
            onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
          />
          <Field
            label="شماره موبایل"
            dir="ltr"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Field
            label="استان"
            value={form.province}
            onChange={(v) => setForm((f) => ({ ...f, province: v }))}
          />
          <Field
            label="شهر"
            value={form.city}
            onChange={(v) => setForm((f) => ({ ...f, city: v }))}
          />
          <Field
            label="کد پستی"
            dir="ltr"
            value={form.postalCode}
            onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))}
            className="sm:col-span-2"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="addressLine">آدرس کامل</Label>
          <textarea
            id="addressLine"
            required
            rows={3}
            value={form.addressLine}
            onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
            className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-border p-6 lg:col-span-2">
        <h2 className="text-sm font-medium">خلاصه سفارش</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {item.name}
                {item.size && ` (${item.size})`}
                <span className="pr-1"> × {toPersianDigits(item.quantity)}</span>
              </span>
              <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium">
          <span>جمع جزء</span>
          <span>
            <span>{formatPrice(subtotal)}</span>
            <span> تومان</span>
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          هزینه ارسال در مرحله‌ی بعد به صورتحساب اضافه می‌شود.
        </p>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full">
          {loading ? "در حال ثبت سفارش..." : "ادامه به درگاه پرداخت"}
        </Button>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl";
  className?: string;
}): ReactNode {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      <Input dir={dir} required value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
