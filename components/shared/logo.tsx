import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/content";
import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-6 w-6 shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="3"
        className="fill-primary"
      />
      <g
        stroke="currentColor"
        className="text-background"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <line x1="7" y1="24" x2="17" y2="8" />
        <line x1="14" y1="24" x2="24" y2="8" />
        <line x1="21" y1="24" x2="27" y2="14" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      {/* <LogoMark className={markClassName} /> */}
      {/* <span className="text-lg font-bold tracking-normal">{siteConfig.site.name}</span> */}
      <Image
        src="/logo.png"
        alt={siteConfig.site.name}
        width={40}
        height={40}
      />
      <Image
        src="/webname.png"
        alt={siteConfig.site.name}
        width={90}
        height={90}
      />
    </span>
  );
}

export function WhiteLogo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <Image
        src="/white-logo.png"
        alt={siteConfig.site.name}
        width={140}
        height={140}
      />
    </span>
  );
}
