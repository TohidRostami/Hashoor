import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { getOrderForAdmin } from "@/lib/queries/admin-orders";
import { formatPrice } from "@/lib/format";
import { formatJalali } from "@/lib/date";

export const metadata: Metadata = { title: "جزئیات سفارش | پنل مدیریت" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderForAdmin(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="">{order.orderNumber}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatJalali(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-6 lg:col-span-2">
          <h2 className="text-sm font-medium">اقلام سفارش</h2>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm first:pt-0 last:pb-0">
                <span>
                  {item.name}
                  {item.size && ` (${item.size})`}
                  <span className=" text-muted-foreground"> × {item.quantity}</span>
                </span>
                <span className="">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>جمع جزء</span>
              <span className="">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>هزینه ارسال</span>
              <span className="">{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
              <span>مجموع</span>
              <span className="">{formatPrice(order.total)} تومان</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border p-6">
            <h2 className="text-sm font-medium">مشتری</h2>
            <p className="mt-3 text-sm">{order.customer?.name ?? "—"}</p>
            {order.customer?.email && !order.customer.email.endsWith("@hashor-phone.local") && (
              <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                {order.customer.email}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border p-6">
            <h2 className="text-sm font-medium">آدرس تحویل</h2>
            {order.address ? (
              <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="text-foreground">نام و نام خانوادگی: {order.address.fullName}</span>
                <span className="text-right" dir="ltr">
                  شماره تماس: {order.address.phone}
                </span>
                <span>
                  استان و شهر: {order.address.province}، {order.address.city}
                </span>
                <span>آدرس: {order.address.addressLine}</span>
                <span>
                  کد پستی: <span className="">{order.address.postalCode}</span>
                </span>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">آدرسی ثبت نشده است.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
