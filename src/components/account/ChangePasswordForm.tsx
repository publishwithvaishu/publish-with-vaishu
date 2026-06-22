"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/account-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function ChangePasswordForm() {
  const [state, action] = useActionState(
    changePasswordAction,
    initialActionState,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} success={state.success} />
      <FormField
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.currentPassword}
      />
      <FormField
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.newPassword}
        hint="At least 8 characters"
      />
      <SubmitButton pendingText="Updating…">Change password</SubmitButton>
    </form>
  );
}
