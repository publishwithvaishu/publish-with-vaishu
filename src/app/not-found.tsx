import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      {/* Ambient gold glow — decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(232,182,71,0.12)_0%,_transparent_70%)]"
      />
      <div className="card-dark relative rounded-3xl p-10 sm:p-14">
        <span className="inline-flex items-center rounded-full border border-[#e8b647]/40 bg-[#e8b647]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
          404
        </span>
        <h1 className="mt-5 font-serif text-3xl text-ink sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-gold inline-flex h-12 items-center justify-center rounded-xl px-7 text-sm font-semibold"
          >
            Back to home
          </Link>
          <Link
            href="/books"
            className="glass-dark inline-flex h-12 items-center justify-center rounded-xl px-7 text-sm font-semibold text-ink transition-colors hover:border-[#e8b647]/40"
          >
            Browse books
          </Link>
        </div>
      </div>
    </main>
  );
}
