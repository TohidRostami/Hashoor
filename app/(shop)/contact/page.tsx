import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های ارتباط با فروشگاه ${siteConfig.site.name}.`,
};

const ROWS = [
  { icon: Phone, label: "تلفن", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
  { icon: Mail, label: "ایمیل", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: MapPin, label: "آدرس", value: siteConfig.contact.address },
  { icon: Clock, label: "ساعات پاسخ‌گویی", value: siteConfig.contact.workingHours },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">تماس با ما</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">در ارتباط باشید</h1>
      <p className="mt-4 max-w-lg text-pretty leading-7 text-muted-foreground">
        برای سؤال درباره‌ی سفارش، سایز، یا هر موضوع دیگری، از راه‌های زیر با ما در تماس باشید.
      </p>

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border">
        {ROWS.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-center gap-4 py-5">
            <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              {href ? (
                <a href={href} dir="ltr" className="text-sm text-foreground hover:underline">
                  {value}
                </a>
              ) : (
                <p className="text-sm text-foreground">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
