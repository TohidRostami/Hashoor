import { listAddressesForUser } from "@/lib/queries/addresses";
import { AddressList } from "@/components/account/address-list";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata = { title: "آدرس‌های من" };

export default async function AddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const addresses = await listAddressesForUser(session!.user.id);

  return <AddressList addresses={addresses} />;
}
