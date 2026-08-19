import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { PaymentSimulatorActions } from "@/components/shop/payment-simulator-actions";

export const metadata: Metadata = { title: "درگاه پرداخت" };

type Order = { id: string; orderNumber: string; total: number };

export default async function PaymentSimulatorPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = (await prisma.order.findUnique({ where: { id: orderId } })) as Order | null;
  if (!order) notFound();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 text-center">
      <div className="w-full rounded-lg border-2 border-dashed border-accent-2 p-8">
        <p className="text-xs font-medium text-accent-2">درگاه پرداخت — نسخه‌ی شبیه‌سازی‌شده</p>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          این صفحه فقط برای تکمیل و تست جریان سفارش قبل از اتصال درگاه واقعیه. بعد از وصل‌کردن
          درگاه (زرین‌پال/زیبال/آی‌دی‌پی/...) در <code dir="ltr">lib/payment/index.ts</code>،
          کاربر مستقیم به همون درگاه هدایت می‌شه و این صفحه دیگه استفاده نمی‌شه.
        </p>

        <div className="mt-6 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">مبلغ قابل پرداخت</p>
          <p className="mt-1 text-2xl font-bold">
            <span className="font-nums">{formatPrice(order.total)}</span>
            <span className="mr-1.5 text-sm font-normal text-muted-foreground">تومان</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            سفارش <span className="font-nums">{order.orderNumber}</span>
          </p>
        </div>

        <PaymentSimulatorActions orderId={order.id} />
      </div>
    </div>
  );
}
