import { Shirt, Truck, Wallet, Headset } from "lucide-react";
import { siteConfig } from "@/lib/content";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const icons = [Shirt, Truck, Wallet, Headset];

export function ValueProps() {
  const items = siteConfig.home.valueProps;
  return (
    <section className="bg-surface">
      <div className="container-page grid grid-cols-2 gap-6 py-8 px-6 lg:grid-cols-4 lg:gap-8">
        {items.map((badge, i) => {
          const Icon = icons[i % icons.length];
          return (
            <RevealOnScroll
              key={badge.title}
              delay={i * 80}
              className="flex flex-col items-center justify-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-primary text-nowrap">
                  {badge.title}
                </h3>
                <p className="mt-0.5 text-xs text-ink-muted text-center">
                  {badge.description}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
