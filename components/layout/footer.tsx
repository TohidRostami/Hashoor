import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { FaInstagram, FaTelegram } from 'react-icons/fa'
import { Logo, WhiteLogo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/content";
import { toPersianDigits } from "@/lib/format";

const trustItems = [
  { icon: Truck, label: "ارسال به سراسر ایران" },
  { icon: RotateCcw, label: "۷ روز ضمانت بازگشت" },
  { icon: ShieldCheck, label: "پرداخت امن" },
];

export function SiteFooter() {
  return (
    <footer className="m-4 rounded-3xl bg-dark-blue shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 flex flex-col items-start gap-4">
            <WhiteLogo />
            <p className="max-w-xs text-sm leading-7 text-white">
              {siteConfig.site.shortDescription}
            </p>
            <div className="flex items-center gap-4 pt-1 text-sm">
              <Link
                href={siteConfig.social.instagram}
                className="text-white underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                <FaInstagram size={30}/>
              </Link>
              <Link
                href={siteConfig.social.telegram}
                className="text-white underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
               <FaTelegram size={30}/>
              </Link>
            </div>
          </div>

          {siteConfig.nav.footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col-reverse items-center justify-between gap-4 py-6 text-xs text-white sm:flex-row">
          <p className="text-start">
            © <span>{toPersianDigits(new Date().getFullYear())}</span>{" "}
            {siteConfig.site.nameLatin}. تمام حقوق محفوظ است.
          </p>
          <p className="font-nums" dir="ltr">
            {siteConfig.contact.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
