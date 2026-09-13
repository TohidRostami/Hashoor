"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { AddressInput } from "@/lib/address";

type Address = AddressInput & { id: string };

export function AddressList({ addresses: initial }: { addresses: Address[] }) {
  const [addresses, setAddresses] = useState(initial);

  return (
    <div className="rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-base font-extrabold">آدرس‌های من</h1>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="هنوز آدرسی ثبت نکرده‌اید" />
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border p-4"
            >
              <div className="text-sm">
                <div className="mb-1 font-bold">
                  {addr.fullName} · {addr.phone}
                </div>
                <div>
                  {addr.province}، {addr.city}، {addr.addressLine} —{" "}
                  {addr.postalCode}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
