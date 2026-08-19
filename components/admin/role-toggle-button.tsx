"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setUserRole } from "@/app/admin/users/actions";

export function RoleToggleButton({
  userId,
  role,
}: {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const nextRole = role === "ADMIN" ? "CUSTOMER" : "ADMIN";

  function handleClick() {
    const message =
      nextRole === "ADMIN"
        ? "این کاربر به ادمین ارتقا پیدا می‌کند. ادامه می‌دهید؟"
        : "دسترسی ادمین این کاربر حذف می‌شود. ادامه می‌دهید؟";
    if (!confirm(message)) return;

    startTransition(async () => {
      const result = await setUserRole(userId, nextRole);
      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(nextRole === "ADMIN" ? "کاربر ادمین شد" : "دسترسی ادمین حذف شد");
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isPending}>
      {nextRole === "ADMIN" ? "ارتقا به ادمین" : "حذف دسترسی ادمین"}
    </Button>
  );
}
