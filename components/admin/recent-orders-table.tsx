import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/order-status";

type Row = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  customer: { name: string } | null;
};

export function RecentOrdersTable({ orders }: { orders: Row[] }) {
  if (orders.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-muted-foreground">
        هنوز سفارشی ثبت نشده است.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-center">سفارش</TableHead>
          <TableHead className="text-center">مشتری</TableHead>
          <TableHead className="text-center">وضعیت</TableHead>
          <TableHead className="text-center">مبلغ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="text-center">
              <Link
                href={`/admin/orders/${order.id}`}
                className="font-nums text-accent-2 hover:underline"
              >
                {order.orderNumber}
              </Link>
            </TableCell>
            <TableCell className="text-center text-muted-foreground">{order.customer?.name ?? "—"}</TableCell>
            <TableCell>
              <Badge className={ORDER_STATUS_TONE[order.status] + " text-center"}>
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-center p-2">{formatPrice(order.total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
