import type { Metadata } from "next";
import { LoginForm } from "@/components/shop/login-form";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = { title: "ورود" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const [{ redirect }, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);

  return (
    <>
      <h1 className="mb-6 text-center text-xl font-bold">ورود به هاشور</h1>
      <LoginForm
        emailEnabled={settings.emailLoginEnabled}
        smsEnabled={settings.smsLoginEnabled}
        redirectTo={redirect ?? "/"}
      />
    </>
  );
}
