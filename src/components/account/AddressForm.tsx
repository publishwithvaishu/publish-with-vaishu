"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { initialActionState, type ActionState } from "@/lib/forms/types";
import type { Address } from "@/lib/auth/addresses";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function AddressForm({
  action,
  address,
  submitLabel,
}: {
  action: Action;
  address?: Address;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const router = useRouter();

  // On success, return to the address list.
  useEffect(() => {
    if (state.ok) {
      router.push("/account/addresses");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      {address && <input type="hidden" name="id" value={address.id} />}

      <FormField
        label="Full name"
        name="full_name"
        defaultValue={address?.full_name ?? ""}
        autoComplete="name"
        required
        error={state.fieldErrors?.full_name}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Mobile"
          name="mobile"
          type="tel"
          inputMode="tel"
          defaultValue={address?.mobile ?? ""}
          autoComplete="tel"
          required
          error={state.fieldErrors?.mobile}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={address?.email ?? ""}
          autoComplete="email"
          error={state.fieldErrors?.email}
          hint="Optional"
        />
      </div>
      <FormField
        label="Address"
        name="address"
        defaultValue={address?.address ?? ""}
        autoComplete="street-address"
        required
        error={state.fieldErrors?.address}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="City"
          name="city"
          defaultValue={address?.city ?? ""}
          required
          error={state.fieldErrors?.city}
        />
        <FormField
          label="State"
          name="state"
          defaultValue={address?.state ?? ""}
          required
          error={state.fieldErrors?.state}
        />
        <FormField
          label="Pincode"
          name="pincode"
          inputMode="numeric"
          defaultValue={address?.pincode ?? ""}
          autoComplete="postal-code"
          required
          error={state.fieldErrors?.pincode}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          name="is_default"
          defaultChecked={address?.is_default ?? false}
          className="h-4 w-4 rounded border-hairline"
        />
        Set as default shipping address
      </label>

      <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
    </form>
  );
}
