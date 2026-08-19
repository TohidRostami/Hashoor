import { cn } from "@/lib/utils";

/**
 * A row of measuring-tape tick marks — every 5th tick taller, every 10th
 * labeled. Doubles as a nod to هاشور's technical-drawing origin and to
 * a tailor's measuring tape.
 */
export function RulerStrip({ className, count = 72 }: { className?: string; count?: number }) {
  const ticks = Array.from({ length: count });

  return (
    <div className={cn("flex h-10 items-end", className)} aria-hidden="true">
      {ticks.map((_, i) => {
        const isMajor = i % 10 === 0;
        const isMid = i % 5 === 0;
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5">
            {isMajor && (
              <span className="font-nums text-[9px] leading-none text-current opacity-50">
                {i}
              </span>
            )}
            <span
              className={cn(
                "w-px bg-current",
                isMajor ? "h-4 opacity-70" : isMid ? "h-2.5 opacity-40" : "h-1.5 opacity-20"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
