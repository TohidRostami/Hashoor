import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شرایط مرجوعی",
  description: "شرایط و مراحل مرجوعی یا تعویض کالا در فروشگاه هاشور.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">راهنما</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">شرایط مرجوعی</h1>

      <div className="mt-8 flex flex-col gap-6 text-pretty leading-7 text-muted-foreground">
        <section>
          <h2 className="text-sm font-medium text-foreground">مهلت مرجوعی</h2>
          <p className="mt-2">
            تا ۷ روز پس از تحویل سفارش، امکان مرجوعی یا تعویض کالا وجود دارد.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">شرایط پذیرش</h2>
          <p className="mt-2">
            کالا باید استفاده‌نشده، بدون آسیب، و همراه با برچسب و بسته‌بندی اصلی باشد.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">روند مرجوعی</h2>
          <p className="mt-2">
            از بخش «سفارش‌های من» در حساب کاربری، درخواست مرجوعی را ثبت کنید تا مراحل بعدی برایتان
            پیامک شود.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-foreground">بازگشت وجه</h2>
          <p className="mt-2">
            پس از تأیید سلامت کالا، مبلغ حداکثر تا ۷۲ ساعت کاری به همان روش پرداخت اولیه بازمی‌گردد.
          </p>
        </section>
      </div>
    </div>
  );
}
