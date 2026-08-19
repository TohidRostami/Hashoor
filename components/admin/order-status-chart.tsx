"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

const COLORS = ["#080808", "#4b5979", "#584f48", "#a99c8f", "#8b98ae", "#a13b2a", "#3f6b4a"];

export function OrderStatusChart({ statusCounts }: { statusCounts: Record<string, number> }) {
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: ORDER_STATUS_LABELS[status] ?? status,
    value: count,
  }));

  if (data.length === 0) {
    return (
      <p className="flex h-[260px] items-center justify-center text-center text-sm text-muted-foreground">
        هنوز سفارشی ثبت نشده است.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            borderRadius: 6,
            border: "1px solid var(--color-border)",
            background: "var(--color-card)",
          }}
        />
        <Legend
          wrapperStyle={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
          formatter={(value) => <span style={{ color: "var(--color-foreground)" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
