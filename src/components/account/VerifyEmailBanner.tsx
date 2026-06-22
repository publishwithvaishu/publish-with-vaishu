"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/lib/actions/account-actions";
import { initialActionState } from "@/lib/forms/types";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function VerifyEmailBanner() {
  const [state, action] = useActionState(
    resendVerificationAction,
    initialActionState,
  );

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      {state.success ? (
        <p className="text-sm text-amber-800">{state.success}</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-800">
            Your email isn’t verified yet. Verify it to secure your account.
          </p>
          <form action={action}>
            <SubmitButton
              variant="outline"
              pendingText="Sending…"
              className="h-10 border-amber-300 px-4 text-amber-900"
            >
              Resend email
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
