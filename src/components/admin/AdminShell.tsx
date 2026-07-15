import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/lib/actions/auth-actions";

/** Admin chrome: top bar with brand, nav, "view store", and sign out. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logo-emblem.png"
                alt="Publish With Vaishu"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                priority
              />
              <span className="font-serif text-lg font-semibold tracking-tight text-ink">
                Publish With Vaishu
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                Admin
              </span>
            </Link>

            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="hidden text-muted hover:text-indigo-600 sm:inline"
              >
                View store ↗
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-medium text-muted hover:text-indigo-600"
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
