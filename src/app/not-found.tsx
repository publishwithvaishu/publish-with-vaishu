import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="rounded-2xl border border-hairline bg-bg p-10 sm:p-14">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
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
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.99]"
          >
            Back to home
          </Link>
          <Link
            href="/books"
            className="inline-flex h-12 items-center justify-center rounded-full border border-hairline bg-bg px-7 text-sm font-medium text-ink transition-all duration-200 hover:bg-bg-secondary"
          >
            Browse books
          </Link>
        </div>
      </div>
    </main>
  );
}
