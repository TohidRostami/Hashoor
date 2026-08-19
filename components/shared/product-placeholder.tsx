import { cn } from "@/lib/utils";
import { GarmentGlyph, type GarmentVariant } from "@/components/shared/garment-glyph";

const TONES: Record<GarmentVariant, string> = {
  shirts: "bg-[var(--brand-surface)] text-[var(--brand-primary)]",
  tshirts: "bg-[#e8e2d8] text-[var(--brand-primary)]",
  pants: "bg-[#dcd9d1] text-[var(--brand-primary)]",
  outerwear: "bg-[var(--brand-secondary)] text-[var(--brand-background)]",
  shoes: "bg-[#e3ded3] text-[var(--brand-accent)]",
  accessories: "bg-[#e6e0d6] text-[var(--brand-accent-2)]",
};

export function ProductPlaceholder({
  variant,
  className,
}: {
  variant: GarmentVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden",
        TONES[variant],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 7px)",
        }}
      />
      <GarmentGlyph
        variant={variant}
        className="relative h-[46%] w-[46%] opacity-90"
      />
    </div>
  );
}
