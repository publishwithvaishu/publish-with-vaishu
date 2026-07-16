import Link from "next/link";
import Image from "next/image";

/**
 * Centered glass card on the dark luxury background — shared by every auth
 * page (login, register, forgot/reset password, admin sign in). Same props
 * and content, premium dark skin with a soft gold ambient glow.
 *
 * Carries `theme-dark` itself so it renders correctly even under a parent
 * that opts out of the dark theme (e.g. /admin/login sits inside the admin
 * layout's light `theme-admin` wrapper — the admin *dashboard* stays light,
 * but its sign-in screen still matches the brand).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="theme-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-5 py-12">
      {/* Ambient gold glow — decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(232,182,71,0.13)_0%,_transparent_70%)]"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8b647]/60 bg-[#11151d] shadow-[0_0_18px_-6px_rgba(232,182,71,0.5)]">
            <Image
              src="/logo-emblem.png"
              alt=""
              width={60}
              height={34}
              className="h-[30px] w-auto object-contain"
            />
          </span>
          <span>
            <span className="block font-serif text-lg font-semibold uppercase tracking-wide text-ink">
              Publish With Vaishu
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
              Empowering Authors. Enriching Minds.
            </span>
          </span>
        </Link>

        <div className="glass-dark mt-8 rounded-2xl p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:p-8">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-ink">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        )}
      </div>
    </main>
  );
}
