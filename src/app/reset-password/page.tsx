import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { FormAlert } from "@/components/forms/FormAlert";

export const metadata: Metadata = { title: "Reset password" };

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const token = first(sp.token) ?? "";

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/login" className="font-medium text-ink underline">
          Back to sign in
        </Link>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <FormAlert error="This reset link is invalid. Please request a new one from the Forgot password page." />
      )}
    </AuthShell>
  );
}
