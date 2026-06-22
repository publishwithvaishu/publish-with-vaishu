import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormAlert } from "@/components/forms/FormAlert";
import { Button } from "@/components/ui/Button";
import { consumeToken } from "@/lib/auth/tokens";
import { markEmailVerified } from "@/lib/auth/users";

export const metadata: Metadata = { title: "Verify email" };

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const token = first(sp.token);

  let status: "ok" | "invalid" = "invalid";
  if (token) {
    const result = await consumeToken(token, "verify");
    if (result) {
      await markEmailVerified(result.userId);
      status = "ok";
    }
  }

  return (
    <AuthShell title="Email verification">
      {status === "ok" ? (
        <div className="space-y-5">
          <FormAlert success="Your email has been verified. Thank you!" />
          <Button href="/account" className="w-full">
            Go to your account
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <FormAlert error="This verification link is invalid or has expired." />
          <p className="text-sm text-muted">
            Sign in and request a new verification email from your account page.
          </p>
          <Link href="/login" className="font-medium text-ink underline">
            Back to sign in
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
