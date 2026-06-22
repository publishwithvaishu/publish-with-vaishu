import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Admin sign in" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <AuthShell
      title="Admin sign in"
      subtitle="Restricted area — Publish With Vaishu staff only."
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
