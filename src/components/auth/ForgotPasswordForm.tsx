"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(
    forgotPasswordAction,
    initialActionState,
  );

  if (state.success) {
    return <FormAlert success={state.success} />;
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <SubmitButton className="w-full" pendingText="Sending link…">
        Send reset link
      </SubmitButton>
    </form>
  );
}
