"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function LoginForm({
  callbackUrl = "/account",
  notice,
}: {
  callbackUrl?: string;
  notice?: string;
}) {
  const [state, action] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="space-y-4" noValidate>
      {notice && <FormAlert success={notice} />}
      <FormAlert error={state.error} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <div>
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          error={state.fieldErrors?.password}
        />
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-muted hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <SubmitButton className="w-full" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
