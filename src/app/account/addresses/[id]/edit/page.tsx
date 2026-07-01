import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressForm } from "@/components/account/AddressForm";
import { updateAddressAction } from "@/lib/actions/address-actions";
import { requireDbUser } from "@/lib/auth/session";
import { getAddress } from "@/lib/auth/addresses";

export const metadata: Metadata = { title: "Edit address" };

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireDbUser();
  const address = await getAddress(user.id, id);
  if (!address) notFound();

  return (
    <div className="rounded-2xl border border-hairline p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Edit address
        </h2>
        <Link
          href="/account/addresses"
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
      <div className="mt-6">
        <AddressForm
          action={updateAddressAction}
          address={address}
          submitLabel="Update address"
        />
      </div>
    </div>
  );
}
