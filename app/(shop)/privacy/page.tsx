import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: `سیاست حریم خصوصی فروشگاه ${siteConfig.site.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">قوانین</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">حریم خصوصی</h1>

      <div className="mt-6 rounded-md border border-dashed border-border bg-secondary/40 px-4 py-3 text-xs leading-6 text-muted-foreground">
        این متن یک نمونه‌ی پایه است و باید پیش از انتشار نهایی، متناسب با فرآیندهای واقعی فروشگاه و
        در صورت امکان با مشورت حقوقی، بازبینی و تکمیل شود.
      </div>

      <div className="mt-8 flex flex-col gap-6 text-pretty leading-7 text-muted-foreground">
        <section>
          <h2 className="text-sm font-medium text-foreground">اطلاعاتی که جمع‌آوری می‌کنیم</h2>
          <p className="mt-2">
            برای ثبت سفارش، اطلاعاتی مثل نام، شماره موبایل، ایمیل و آدرس پستی شما ذخیره می‌شود. این
            اطلاعات فقط برای پردازش سفارش و ارتباط با شما استفاده می‌شود.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">نگهداری اطلاعات پرداخت</h2>
          <p className="mt-2">
            اطلاعات کارت بانکی شما هرگز در سرورهای {siteConfig.site.name} ذخیره نمی‌شود؛ پرداخت
            مستقیماً از طریق درگاه بانکی معتبر انجام می‌شود.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">اشتراک‌گذاری اطلاعات</h2>
          <p className="mt-2">
            اطلاعات شما با هیچ شخص یا شرکت ثالثی به‌جز خدمات لازم برای ارسال مرسوله (مثل شرکت
            پستی) به اشتراک گذاشته نمی‌شود.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">دسترسی و حذف اطلاعات</h2>
          <p className="mt-2">
            برای مشاهده، ویرایش یا درخواست حذف اطلاعات حساب کاربری‌تان می‌توانید از طریق صفحه‌ی
            تماس با ما با تیم پشتیبانی در ارتباط باشید.
          </p>
        </section>
      </div>
    </div>
  );
}
