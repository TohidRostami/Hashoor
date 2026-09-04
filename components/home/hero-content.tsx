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
    <section className="relative m-4 min-h-[78vh] overflow-hidden rounded-3xl border-b border-border">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={heroImages[currentSlide]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.5, ease: "easeInOut" },
              scale: { duration: 5, ease: "linear" },
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentSlide]})`,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-[1] bg-black/35" />

      {/* Gradient for better text readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* HatchField */}
      {/* <div className="pointer-events-none absolute inset-0 z-[3] text-accent/70">
        <HatchField />
      </div> */}

      {/* Fixed Content */}
      <div className="relative z-10 mx-auto flex min-h-[79vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-2xl"
        >
          <Badge variant="secondary" className="mb-7 border-foreground/20 py-1">
            {hero.eyebrow}
          </Badge>

          <h1 className="text-secondary text-4xl font-black leading-[1.02] sm:text-6xl lg:text-[5.25rem]">
            {hero.headline}
          </h1>

          <p className="mt-7 max-w-lg text-pretty text-base leading-8 text-secondary sm:text-lg">
            {hero.subheadline}
          </p>

          <div className="mt-10 flex gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button size="sm" className="w-full sm:w-auto bg-dark-blue" asChild>
              <Link href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href={hero.ctaSecondary.href}>
                {hero.ctaSecondary.label}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Strip
      <div className="relative z-10 mx-auto max-w-7xl">
        <RulerStrip className="border-t border-border/70 text-muted-foreground" />
      </div> */}
    </section>
  );
}
