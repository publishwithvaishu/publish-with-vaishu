import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/lib/actions/auth-actions";

/** Admin chrome: top bar with brand, nav, "view store", and sign out. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg/85 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold tracking-tight text-ink">
                Publish With Vaishu
              </span>
              <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Admin
              </span>
            </Link>

            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="hidden text-muted hover:text-ink sm:inline"
              >
                View store ↗
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-medium text-muted hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </Container>
      </header>

      <main className="pb-16">
        <Container className="py-8 sm:py-10">{children}</Container>
      </main>
    </div>
  );
}
