import type { Metadata } from "next";
import { Wallet, ShoppingBag, Package, Users } from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusChart } from "@/components/admin/order-status-chart";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { getDashboardStats, getRecentOrders } from "@/lib/queries/admin";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "داشبورد | پنل مدیریت" };

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(8),
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-lg border border-border p-6 lg:col-span-2">
          <h2 className="text-sm font-medium">وضعیت سفارش‌ها</h2>
          <OrderStatusChart statusCounts={stats.statusCounts} />
        </div>

        <div className="rounded-lg border border-border py-6 lg:col-span-3">
          <div className="text-center border-b pb-3">
            <h2 className="px-6 text-sm font-medium">سفارش‌های اخیر</h2>
          </div>
          <div>
            <RecentOrdersTable orders={recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
