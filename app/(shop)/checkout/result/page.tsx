import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "نتیجه پرداخت" };

type Order = { id: string; orderNumber: string; total: number; status: string };

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string }>;
}) {
  const { order: orderId, status } = await searchParams;
  const order = orderId
    ? ((await prisma.order.findUnique({ where: { id: orderId } })) as Order | null)
    : null;
  const success = status === "success" && order?.status === "PAID";

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-28 text-center">
        <p className="text-sm text-muted-foreground">سفارشی با این مشخصات پیدا نشد.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/products">بازگشت به فروشگاه</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {success ? (
        <CheckCircle2 className="size-14 text-success" strokeWidth={1.3} />
      ) : (
        <XCircle className="size-14 text-destructive" strokeWidth={1.3} />
      )}

      <h1 className="mt-6 text-xl font-bold">
        {success ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {success
          ? "سفارش شما ثبت شد و به‌زودی پردازش می‌شود."
          : "مبلغی از حساب شما کسر نشده است. می‌توانید دوباره تلاش کنید."}
      </p>

      <div className="mt-6 flex flex-col gap-1 text-sm text-muted-foreground">
        <span>
          شماره سفارش: <span className="font-nums">{order.orderNumber}</span>
        </span>
        <span>
          مبلغ: <span className="font-nums">{formatPrice(order.total)}</span> تومان
        </span>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {success ? (
          <Button asChild size="lg">
            <Link href="/account">مشاهده سفارش‌ها</Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href="/checkout">تلاش مجدد</Link>
          </Button>
        )}
        <Button asChild size="lg" variant="outline">
          <Link href="/products">ادامه خرید</Link>
        </Button>
      </div>
    </div>
  );
}
