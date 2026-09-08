import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { useSession } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?next=/account");

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="flex flex-wrap items-start gap-5.5">
        <AccountSidebar name={session.user.name} subtitle="عضو باشگاه هاشور" />
        <div className="min-w-0 flex-[999_1_420px]">{children}</div>
      </div>
    </main>
  );
}
