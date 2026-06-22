"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialActionState);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      <FormField
        label="Full name"
        name="name"
        autoComplete="name"
        required
        error={state.fieldErrors?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <FormField
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={state.fieldErrors?.phone}
        hint="Optional"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password}
        hint="At least 8 characters"
      />
      <SubmitButton className="w-full" pendingText="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
