import Link from "next/link";
import Image from "next/image";

/** Centered card layout for the public auth pages. */
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
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-center font-serif text-lg font-semibold tracking-tight text-ink"
        >
          <Image
            src="/logo-emblem.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          Publish With Vaishu
        </Link>

        <div className="mt-8 rounded-2xl border border-hairline p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
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
