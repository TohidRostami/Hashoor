import { cn } from "@/lib/utils";

export type GarmentVariant =
  | "shirts"
  | "tshirts"
  | "pants"
  | "outerwear"
  | "shoes"
  | "accessories";

const common = {
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Minimal fashion-flat style line icons — deliberately abstract, not
 * photographic. Used as product-image placeholders until real photography
 * is uploaded through the admin panel. Ties to the هاشور (hatching /
 * technical-drawing) concept instead of faking a product photo.
 */
function GarmentPath({ variant }: { variant: GarmentVariant }) {
  switch (variant) {
    case "shirts":
      return (
        <g {...common}>
          <path d="M40 24 L50 32 L60 24 L74 30 L80 46 L70 50 L68 40 L68 84 L32 84 L32 40 L30 50 L20 46 L26 30 Z" />
          <line x1="50" y1="38" x2="50" y2="80" strokeDasharray="1 5" />
          <rect x="41" y="42" width="12" height="14" />
        </g>
      );
    case "tshirts":
      return (
        <g {...common}>
          <path d="M38 26 Q50 34 62 26 L78 34 L72 46 L66 41 L66 84 L34 84 L34 41 L28 46 L22 34 Z" />
        </g>
      );
    case "pants":
      return (
        <g {...common}>
          <path d="M32 20 H68 L70 30 H30 Z" />
          <path d="M31 30 L34 84 L46 84 L50 40 L54 84 L66 84 L69 30 Z" />
          <line x1="50" y1="30" x2="50" y2="40" />
        </g>
      );
    case "outerwear":
      return (
        <g {...common}>
          <path d="M38 22 L50 30 L62 22 L78 30 L84 48 L72 53 L70 42 L70 86 L30 86 L30 42 L28 53 L16 48 L22 30 Z" />
          <line x1="50" y1="30" x2="50" y2="86" />
          <line x1="30" y1="58" x2="70" y2="58" strokeDasharray="1 5" />
        </g>
      );
    case "shoes":
      return (
        <g {...common}>
          <path d="M14 68 L14 55 Q14 50 19 48 L26 45 Q34 42 42 43 L58 44 Q68 45 76 51 L82 56 Q86 59 85 63 Q84 67 79 67 L14 68 Z" />
          <line x1="26" y1="45" x2="30" y2="51" />
          <line x1="38" y1="43" x2="41" y2="50" />
        </g>
      );
    case "accessories":
      return (
        <g {...common}>
          <rect x="16" y="44" width="68" height="14" rx="3" />
          <rect x="42" y="40" width="16" height="22" rx="2" />
          <line x1="46" y1="51" x2="54" y2="51" />
        </g>
      );
    default:
      return null;
  }
}

export function GarmentGlyph({
  variant,
  className,
}: {
  variant: GarmentVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("stroke-current", className)}
      aria-hidden="true"
    >
      <GarmentPath variant={variant} />
    </svg>
  );
}
