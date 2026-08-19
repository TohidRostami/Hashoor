import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "قوانین و مقررات",
  description: `قوانین و مقررات استفاده از فروشگاه ${siteConfig.site.name}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">قوانین</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">قوانین و مقررات</h1>

      <div className="mt-6 rounded-md border border-dashed border-border bg-secondary/40 px-4 py-3 text-xs leading-6 text-muted-foreground">
        این متن یک نمونه‌ی پایه است و باید پیش از انتشار نهایی، متناسب با فرآیندهای واقعی فروشگاه و
        در صورت امکان با مشورت حقوقی، بازبینی و تکمیل شود.
      </div>

      <div className="mt-8 flex flex-col gap-6 text-pretty leading-7 text-muted-foreground">
        <section>
          <h2 className="text-sm font-medium text-foreground">ثبت سفارش</h2>
          <p className="mt-2">
            با ثبت سفارش در {siteConfig.site.name}، صحت اطلاعات وارد‌شده (آدرس، شماره تماس) را
            تأیید می‌کنید. مسئولیت اشتباه در این اطلاعات بر عهده‌ی کاربر است.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">قیمت‌ها و موجودی</h2>
          <p className="mt-2">
            قیمت‌ها و موجودی کالاها ممکن است بدون اطلاع قبلی تغییر کنند. قیمت نهایی همان است که در
            لحظه‌ی ثبت سفارش نمایش داده می‌شود.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">حساب کاربری</h2>
          <p className="mt-2">
            حفظ محرمانگی اطلاعات ورود (رمز عبور یا دسترسی به شماره موبایل) بر عهده‌ی کاربر است.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">تغییر قوانین</h2>
          <p className="mt-2">
            این قوانین ممکن است در آینده به‌روزرسانی شوند؛ نسخه‌ی فعلی همیشه در همین صفحه در دسترس
            است.
          </p>
        </section>
      </div>
    </div>
  );
}
