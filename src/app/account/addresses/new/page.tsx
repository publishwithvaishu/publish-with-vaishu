import type { Metadata } from "next";
import Link from "next/link";
import { AddressForm } from "@/components/account/AddressForm";
import { addAddressAction } from "@/lib/actions/address-actions";

export const metadata: Metadata = { title: "Add address" };

export default function NewAddressPage() {
  return (
    <div className="rounded-2xl border border-hairline p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Add address
        </h2>
        <Link
          href="/account/addresses"
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="mt-6">
        <AddressForm action={addAddressAction} submitLabel="Save address" />
      </div>
    </div>
  );
}
