import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  if (await getCurrentUser()) redirect("/account");

  const sp = await searchParams;
  const rawCallback = first(sp.callbackUrl);
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") ? rawCallback : "/account";

  const notice = sp.registered
    ? "Account created. We've emailed a verification link — sign in to continue."
    : sp.reset
      ? "Your password was updated. Please sign in."
      : undefined;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          New to Publish With Vaishu?{" "}
          <Link href="/register" className="font-medium text-ink underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm callbackUrl={callbackUrl} notice={notice} />
    </AuthShell>
  );
}
