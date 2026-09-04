import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/lib/content";

export function PhilosophySection() {
  const { philosophy } = siteConfig.home;
  return (
    <section className="m-4  rounded-3xl bg-cream-white shadow-lg">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
        <Reveal className="lg:col-span-4">
          <Badge variant="outline" className="border-foreground/20">
            {philosophy.eyebrow}
          </Badge>
          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
            {philosophy.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <p className="text-center text-pretty text-lg leading-9 text-black">
            {philosophy.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
