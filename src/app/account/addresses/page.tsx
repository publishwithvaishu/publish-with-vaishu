import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import { requireDbUser } from "@/lib/auth/session";
import { listAddresses, type Address } from "@/lib/auth/addresses";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/actions/address-actions";

export const metadata: Metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const user = await requireDbUser();
  const addresses = await listAddresses(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Address book
          </h2>
          <p className="mt-1 text-sm text-muted">
            Saved shipping addresses for faster checkout.
          </p>
        </div>
        <Button href="/account/addresses/new">Add address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No addresses yet</p>
          <p className="mt-2 text-sm text-muted">
            Add a shipping address to use at checkout.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((a) => (
            <AddressCard key={a.id} address={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <li className="rounded-2xl border border-hairline p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-ink">{address.full_name}</p>
            {address.is_default && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-white">
                Default
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {address.address}, {address.city}, {address.state} —{" "}
            {address.pincode}
          </p>
          {address.mobile && (
            <p className="mt-1 text-sm text-muted">{address.mobile}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-4 text-sm">
        <Link
          href={`/account/addresses/${address.id}/edit`}
          className="font-medium text-ink hover:text-muted"
        >
          Edit
        </Link>

        {!address.is_default && (
          <form action={setDefaultAddressAction}>
            <input type="hidden" name="id" value={address.id} />
            <button type="submit" className="text-muted hover:text-ink">
              Set as default
            </button>
          </form>
        )}

        <form action={deleteAddressAction} className="ml-auto">
          <input type="hidden" name="id" value={address.id} />
          <ConfirmSubmit
            message="Delete this address?"
            className="text-muted hover:text-red-300"
          >
            Delete
          </ConfirmSubmit>
        </form>
      </div>
    </li>
  );
}
