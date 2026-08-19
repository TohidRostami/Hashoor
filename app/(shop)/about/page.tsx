import type { Metadata } from "next";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `داستان برند ${siteConfig.site.name} و فلسفه‌ی طراحی مینیمال پشت آن.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">درباره ما</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">داستان هاشور</h1>

      <div className="mt-8 flex flex-col gap-5 text-pretty leading-8 text-muted-foreground">
        <p>
          اسم «هاشور» از خطوط موازی و دقیقی می‌آید که در نقشه‌کشی و طراحی صنعتی برای نشان‌دادن
          سایه، برش یا جنس یک سطح استفاده می‌شوند. همان دقت و کم‌گویی را در طراحی پوشاک هم دنبال
          می‌کنیم: بدون تزئین اضافه، با تمرکز روی برش، نسبت‌ها، و پارچه.
        </p>
        <p>
          هر تکه از مجموعه‌ی هاشور با همین نگاه ساخته می‌شود — پارچه‌ای که کیفیتش را در اولین
          لمس حس می‌کنید، و دوختی که برای سال‌ها دوام می‌آورد، نه فقط یک فصل.
        </p>
        <p>
          فروشگاه هاشور یک تیم کوچک است که پوشاک مردانه را برای مردی طراحی می‌کند که به جزئیات
          اهمیت می‌دهد؛ نه دنبال زرق‌وبرق، بلکه دنبال چیزی که درست ساخته شده باشد.
        </p>
      </div>
    </div>
  );
}
