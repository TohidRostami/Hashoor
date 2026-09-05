"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";

export function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    // A new filter narrows the result set, so whatever page you were on
    // may no longer exist — always land back on page 1.
    params.delete("page");
    router.push(`/admin/orders?${params.toString()}`);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateFilter("search", search);
  }

  function clearFilters() {
    setSearch("");
    router.push("/admin/orders");
  }

  // "page"/"perPage" alone (no real filter) shouldn't count as active.
  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "page" && key !== "perPage"
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو با شماره سفارش یا نام مشتری..."
            className="pe-10"
          />
        </div>
        <Button variant="accent" type="submit">
          جستجو
        </Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="w-full sm:w-56">
          <JalaliDatePicker
            value={searchParams.get("date") ?? ""}
            onChange={(value) => updateFilter("date", value)}
            placeholder="فیلتر بر اساس تاریخ سفارش"
          />
        </div>

        {hasFilters && (
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
            <X className="size-4" />
            پاک کردن فیلترها
          </Button>
        )}
      </div>
    </div>
  );
}
