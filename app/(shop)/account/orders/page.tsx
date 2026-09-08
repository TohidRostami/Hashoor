import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrdersForCustomer } from "@/lib/queries/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/order-status";
import { formatToman, toPersianDigits } from "@/lib/format";
import { formatJalali } from "@/lib/date";
import Link from "next/link";
import { Package } from "lucide-react";
export const metadata = { title: "سفارش‌های من" };

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account/orders");
  const orders = await getOrdersForCustomer(session.user.id);
  return (
    <div className="rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-base font-extrabold">سفارش‌های من</div>
      </div>

      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          هنوز سفارشی ثبت نکرده‌اید.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-border p-4 transition-colors hover:border-brand"
            >
              <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-sunken">
                <Package className="size-6 text-muted" strokeWidth={1.5} />
              </div>

              <div className="min-w-[130px] flex-1">
                <div className="mb-1 text-sm font-bold">
                  {o.items[0]?.name}
                  {o.items.length > 1 &&
                    ` + ${toPersianDigits(o.items.length - 1)} کالای دیگر`}
                </div>
                <div className="text-[11.5px] text-black">
                  <span>{formatJalali(o.createdAt)}</span>
                  {" | "}
                  <span> سفارش {o.orderNumber}</span>
                </div>
              </div>

              <span className="whitespace-nowrap rounded-full bg-border px-3 py-1.5 text-[11.5px] font-bold">
                {ORDER_STATUS_LABELS[o.status] ?? o.status}
              </span>

              <div className="text-sm font-extrabold">
                {formatToman(o.total)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
