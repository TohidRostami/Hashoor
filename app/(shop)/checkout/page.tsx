import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata: Metadata = { title: "تسویه حساب" };

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/checkout");

  const phone = (session.user as unknown as { phoneNumber?: string }).phoneNumber;
  const isPlaceholderEmail = session.user.email.endsWith("@hashor-phone.local");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">تسویه حساب</h1>
      <CheckoutForm
        defaultName={isPlaceholderEmail ? "" : session.user.name}
        defaultPhone={phone ?? ""}
      />
    </div>
  );
}
