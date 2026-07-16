import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const current = await getCurrentUser();
  if (current) redirect(current.role === "admin" ? "/admin" : "/account");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Order academic books and track your shipments."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
