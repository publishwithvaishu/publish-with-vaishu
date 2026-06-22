"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(
    resetPasswordAction,
    initialActionState,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      <input type="hidden" name="token" value={token} />
      <FormField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password}
        hint="At least 8 characters"
      />
      <SubmitButton className="w-full" pendingText="Updating…">
        Update password
      </SubmitButton>
    </form>
  );
}
