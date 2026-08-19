"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PER_PAGE_OPTIONS = [4, 8, 10, 25, 50, 100];
const DEFAULT_PER_PAGE = 10;

export function AdminProductsPerPageSelect({ value }: { value: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (Number(next) === DEFAULT_PER_PAGE) {
      params.delete("perPage");
    } else {
      params.set("perPage", next);
    }

    // Same reasoning as changing a filter: the current page number may
    // no longer make sense once the page size changes.
    params.delete("page");

    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="shrink-0 text-sm text-muted-foreground">
        تعداد در صفحه:
      </span>
      <Select value={String(value)} onValueChange={handleChange}>
        <SelectTrigger
          size="sm"
          aria-label="تعداد محصول در صفحه"
          className="w-20"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PER_PAGE_OPTIONS.map((n) => (
            <SelectItem key={n} value={String(n)}>
              <span className="font-gowun-batang">{n}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
