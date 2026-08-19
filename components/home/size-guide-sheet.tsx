"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type SizeInfo = { name: string; description: string | null };

export function SizeGuideSheet({
  open,
  onOpenChange,
  sizes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sizes: SizeInfo[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>راهنمای سایز</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6 sm:px-6">
          {sizes.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              اطلاعات ابعاد برای سایزهای این محصول ثبت نشده است.
            </p>
          ) : (
            <div className="mt-2 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="ps-4">سایز</TableHead>
                    <TableHead className="pe-4">توضیح / ابعاد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizes.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="ps-4 font-nums font-medium">{s.name}</TableCell>
                      <TableCell className="pe-4 text-muted-foreground">
                        {s.description ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
