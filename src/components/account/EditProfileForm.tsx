"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/account-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function EditProfileForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string;
  defaultPhone: string;
}) {
  const [state, action] = useActionState(
    updateProfileAction,
    initialActionState,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} success={state.success} />
      <FormField
        label="Full name"
        name="name"
        defaultValue={defaultName}
        autoComplete="name"
        required
        error={state.fieldErrors?.name}
      />
      <FormField
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        defaultValue={defaultPhone}
        error={state.fieldErrors?.phone}
        hint="Optional"
      />
      <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
    </form>
  );
}
