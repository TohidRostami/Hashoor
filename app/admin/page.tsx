import type { Metadata } from "next";
import { Wallet, ShoppingBag, Package, Users } from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { OutOfStockCard } from "@/components/admin/out-of-stock-card";
import { getDashboardStats, getRecentOrders } from "@/lib/queries/admin";
import { getOutOfStockProducts } from "@/lib/queries/admin-inventory";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "داشبورد | پنل مدیریت" };

export default async function AdminDashboardPage() {
  const [stats, outOfStockProducts] = await Promise.all([
    getDashboardStats(),
    getOutOfStockProducts(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          نمای کلی فروشگاه هاشور
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="درآمد کل"
          value={formatPrice(stats.revenue)}
          unit="تومان"
          icon={Wallet}
        />
        <StatCard
          label="تعداد سفارش‌ها"
          value={stats.orderCount}
          icon={ShoppingBag}
        />
        <StatCard
          label="محصولات فعال"
          value={stats.productCount}
          icon={Package}
        />
        <StatCard label="مشتریان" value={stats.customerCount} icon={Users} />
      </div>

      <OutOfStockCard products={outOfStockProducts} />
    </div>
  );
}
