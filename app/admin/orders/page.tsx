import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getAllOrdersForAdmin } from "@/lib/queries/admin-orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/order-status";

export const metadata: Metadata = { title: "سفارش‌ها | پنل مدیریت" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">سفارش‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-nums">{orders.length}</span> سفارش
        </p>
      </div>

      <div className="rounded-lg border border-border">
        {orders.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">
            هنوز سفارشی ثبت نشده است.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center">سفارش</TableHead>
                <TableHead className="text-center">مشتری</TableHead>
                <TableHead className="text-center">وضعیت</TableHead>
                <TableHead className="text-center">مبلغ</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-center">
                    <span className="">{order.orderNumber}</span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {order.customer?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={ORDER_STATUS_TONE[order.status]}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center ">{formatPrice(order.total)}</TableCell>
                  <TableCell className="pe-6 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-accent-2 hover:underline"
                    >
                      مشاهده
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
