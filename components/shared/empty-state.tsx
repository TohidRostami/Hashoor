import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-border bg-surface px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-muted" strokeWidth={1.4} />
      <p className="text-[15px] font-bold">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild size="sm" className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
