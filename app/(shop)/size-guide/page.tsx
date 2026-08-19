import type { Metadata } from "next";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "راهنمای سایز",
  description: "جدول سایزبندی پوشاک مردانه هاشور برای انتخاب سایز درست.",
};

const SIZES = [
  { size: "S", chest: "88–92", waist: "76–80", height: "168–174" },
  { size: "M", chest: "92–98", waist: "80–86", height: "172–178" },
  { size: "L", chest: "98–104", waist: "86–92", height: "176–182" },
  { size: "XL", chest: "104–110", waist: "92–98", height: "180–186" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">راهنما</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">راهنمای سایز</h1>
      <p className="mt-4 max-w-lg text-pretty leading-7 text-muted-foreground">
        اندازه‌ها بر حسب سانتی‌متر هستند. برای بین دو سایز، معمولاً سایز بزرگ‌تر برای پوشش راحت‌تر
        مناسب‌تر است.
      </p>

      <div className="mt-8 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="ps-6">سایز</TableHead>
              <TableHead>دور سینه</TableHead>
              <TableHead>دور کمر</TableHead>
              <TableHead className="pe-6">قد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SIZES.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="ps-6 font-medium">{row.size}</TableCell>
                <TableCell className="font-nums text-muted-foreground">{row.chest}</TableCell>
                <TableCell className="font-nums text-muted-foreground">{row.waist}</TableCell>
                <TableCell className="font-nums pe-6 text-muted-foreground">{row.height}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
