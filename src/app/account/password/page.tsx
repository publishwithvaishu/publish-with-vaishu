import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = { title: "Change password" };

export default function ChangePasswordPage() {
  return (
    <div className="rounded-2xl border border-hairline p-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink">
        Change password
      </h2>
      <p className="mt-1 text-sm text-muted">
        Choose a strong password you don’t use elsewhere.
      </p>
      <div className="mt-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
