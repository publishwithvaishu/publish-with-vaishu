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
    <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
      {state.success ? (
        <p className="text-sm text-amber-200">{state.success}</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-200">
            Your email isn’t verified yet. Verify it to secure your account.
          </p>
          <form action={action}>
            <SubmitButton
              variant="outline"
              pendingText="Sending…"
              className="h-10 px-4"
            >
              Resend email
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
