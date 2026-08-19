"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const COLS = 46;
const WIDTH = 1400;
const HEIGHT = 640;

function buildLines() {
  const lines: { x: number; y1: number; y2: number }[] = [];
  const gap = WIDTH / COLS;
  for (let i = 0; i < COLS; i++) {
    const x = i * gap + gap / 2;
    // irregular span per line so the field reads as plotted strokes,
    // not a mechanical grid
    const wobble = Math.sin(i * 1.31) * 46 + Math.sin(i * 0.42) * 30;
    lines.push({
      x,
      y1: 30 + wobble * 0.22,
      y2: HEIGHT - 30 - wobble * 0.4,
    });
  }
  return lines;
}

const LINES = buildLines();

/**
 * Full-bleed animated hatching field — the site's signature motif, now
 * spanning the whole hero and reacting to the pointer with a light
 * parallax tilt, like a taut sheet of measuring lines.
 */
export function HatchField({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mvX = useMotionValue(0.5);
  const mvY = useMotionValue(0.5);
  const springX = useSpring(mvX, { stiffness: 45, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 45, damping: 18 });

  const translateX = useTransform(springX, [0, 1], [14, -14]);
  const translateY = useTransform(springY, [0, 1], [6, -6]);
  const skewY = useTransform(springX, [0, 1], [-1.4, 1.4]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width);
    mvY.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    mvX.set(0.5);
    mvY.set(0.5);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("h-full w-full", className)}
    >
      <motion.svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: translateX, y: translateY, skewY }}
      >
        {LINES.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x}
            y1={line.y1}
            x2={line.x + 70}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : {
                    duration: 1.2,
                    delay: 0.1 + i * 0.016,
                    ease: [0.65, 0, 0.35, 1],
                  }
            }
          />
        ))}
      </motion.svg>
    </div>
  );
}
