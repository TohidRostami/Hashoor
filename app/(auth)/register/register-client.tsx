"use client";

import { useRouter } from "next/navigation";
import { EmailForm } from "@/components/shop/login-form";

export function RegisterClient() {
  const router = useRouter();
  return (
    <EmailForm
      mode="register"
      onSuccess={() => {
        router.push("/");
        router.refresh();
      }}
    />
  );
}
