import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { RouteTransitionProvider } from "@/components/shared/route-transition-provider";
import { WhatsAppButton } from "@/components/home/whatsapp-questionbox";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <RouteTransitionProvider>
          <WhatsAppButton />
          {children}
        </RouteTransitionProvider>
      </main>
      <SiteFooter />
    </div>
  );
}
