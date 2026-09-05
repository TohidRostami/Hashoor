"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HatchField } from "@/components/shared/hatch-field";
import { RulerStrip } from "@/components/shared/ruler-strip";
import { siteConfig } from "@/lib/content";

export function HeroContent({ heroImages }: { heroImages: string[] }) {
  const { hero } = siteConfig.home;
  const reduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative m-4 min-h-[77vh] overflow-hidden rounded-[28px] border border-border md:min-h-[74vh]">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={heroImages[currentSlide]}
            initial={{
              opacity: 0,
              scale: 1.06,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              opacity: {
                duration: 0.8,
                ease: "easeInOut",
              },
              scale: {
                duration: 7,
                ease: "linear",
              },
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentSlide]})`,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Subtle overall contrast */}
      <div className="absolute inset-0 z-[1] bg-black/20" />

      {/* Content readability gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 38%, rgba(0,0,0,0.08) 72%, rgba(0,0,0,0.02) 100%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl items-end px-6 py-12 sm:min-h-[76vh] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <motion.div
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <Badge variant="outline" className="mb-7 border-white py-1 text-white">
            {hero.eyebrow}
          </Badge>

          {/* Heading */}
          <h1 className="max-w-[760px] text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {hero.headline}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            {hero.subheadline}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="m"
              className="h-12 w-full rounded-full bg-white px-7 text-black hover:bg-white/90 sm:w-auto"
              asChild
            >
              <Link href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <Button
              size="m"
              variant="ghost"
              className="h-12 w-full rounded-full border border-white/30 bg-white/5 px-7 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto"
              asChild
            >
              <Link href={hero.ctaSecondary.href}>
                {hero.ctaSecondary.label}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
