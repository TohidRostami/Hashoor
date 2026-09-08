import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, MapPin, Package } from "lucide-react";

import { auth } from "@/lib/auth";
import { getOrderForCustomer } from "@/lib/queries/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/order-status";
import { formatToman, toPersianDigits } from "@/lib/format";
import { formatJalali } from "@/lib/date";
import { cn } from "@/lib/utils";

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account/orders");

  const { id } = await params;
  const order = await getOrderForCustomer(id, session.user.id);
  // Same 404 for "doesn't exist" and "belongs to someone else" — no way
  // to tell the two apart from the outside.
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/account/orders"
        className="flex w-fit items-center gap-1 text-sm font-semibold text-black transition-colors hover:text-brand-accent-2"
      >
        <ChevronLeft className="size-4 rotate-180" />
        بازگشت به سفارش‌ها
      </Link>

      {/* Order number, date, status */}
      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-base font-extrabold">سفارش {order.orderNumber}</div>
            <div className="mt-1 text-[12.5px] text-black">{formatJalali(order.createdAt)}</div>
          </div>
          <span
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-[11.5px] font-bold",
              ORDER_STATUS_TONE[order.status]
            )}
          >
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-4 flex items-center gap-2 text-base font-extrabold">
          <MapPin className="size-4.5 text-brand" />
          آدرس ارسال
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="font-bold">{order.address.fullName}</div>
          <div className="text-black" dir="ltr">
            {order.address.phone}
          </div>
          <div className="text-black">
            {order.address.province}، {order.address.city}
          </div>
          <div className="text-black">{order.address.addressLine}</div>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-4 text-base font-extrabold">اقلام سفارش</div>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-border p-4"
            >
              <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-sunken">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="58px" className="object-cover" />
                ) : (
                  <Package className="size-6 text-black" strokeWidth={1.5} />
                )}
              </div>

              <div className="min-w-[130px] flex-1">
                {item.productSlug ? (
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="text-sm font-bold transition-colors hover:text-brand-accent-2"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div className="text-sm font-bold">{item.name}</div>
                )}
                <div className="mt-1 text-[11.5px] text-black">
                  {item.color ?? "—"} / {item.size ?? "—"} · تعداد: {toPersianDigits(item.quantity)}
                </div>
              </div>

              <div className="text-sm font-extrabold">{formatToman(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-4 text-base font-extrabold">جزئیات پرداخت</div>
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black">جمع جزء</span>
            <span>{formatToman(order.subtotal)}</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-success">
              <span>تخفیف{order.discountCode ? ` (${order.discountCode.code})` : ""}</span>
              <span>−{formatToman(order.discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-black">هزینه ارسال</span>
            <span>{order.shippingCost > 0 ? formatToman(order.shippingCost) : "رایگان"}</span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-base font-extrabold">
            <span>مبلغ نهایی</span>
            <span>{formatToman(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}