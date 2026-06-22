"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function AdminLoginForm() {
  const [state, action] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} />
      <input type="hidden" name="callbackUrl" value="/admin" />
      <FormField
        label="Admin email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      <SubmitButton className="w-full" pendingText="Signing in…">
        Sign in to admin
      </SubmitButton>
    </form>
  );
}
