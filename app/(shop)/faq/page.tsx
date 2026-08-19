import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ سوالات پرتکرار درباره سفارش، ارسال و مرجوعی کالا در هاشور.",
};

const FAQS = [
  {
    q: "چقدر طول می‌کشد سفارش من برسد؟",
    a: "ارسال به تهران معمولاً ۱ تا ۲ روز کاری و به سایر شهرها ۲ تا ۴ روز کاری طول می‌کشد.",
  },
  {
    q: "چطور سایز مناسب خودم را انتخاب کنم؟",
    a: "در صفحه‌ی هر محصول، لینک راهنمای سایز موجود است. اگر بین دو سایز مردد بودید، معمولاً سایز بزرگ‌تر راحت‌تر است.",
  },
  {
    q: "آیا امکان مرجوع‌کردن کالا وجود دارد؟",
    a: "بله، تا ۷ روز پس از دریافت، در صورتی که کالا استفاده‌نشده و با برچسب اصلی باشد، امکان مرجوعی یا تعویض وجود دارد.",
  },
  {
    q: "چه روش‌های پرداختی پشتیبانی می‌شود؟",
    a: "پرداخت از طریق درگاه بانکی معتبر انجام می‌شود؛ اطلاعات کارت شما نزد فروشگاه ذخیره نمی‌شود.",
  },
  {
    q: "چطور می‌توانم وضعیت سفارشم را پیگیری کنم؟",
    a: "از بخش «حساب کاربری» و صفحه‌ی «سفارش‌های من» می‌توانید وضعیت هر سفارش را ببینید.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">راهنما</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">سوالات متداول</h1>

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
              {item.q}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
