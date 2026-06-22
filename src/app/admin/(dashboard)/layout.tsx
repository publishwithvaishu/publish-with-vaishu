import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware also guards /admin/*; this is defence-in-depth.
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
