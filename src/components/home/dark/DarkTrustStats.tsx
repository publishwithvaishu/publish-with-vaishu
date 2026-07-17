import { Container } from "@/components/ui/Container";
import { formatCount } from "@/lib/format";
import { getTrustStats } from "@/lib/queries";

/**
 * Trust statistics band — Books · Authors · Courses. Unlike the original
 * (now-orphaned) TrustStats.tsx, this reads live counts from Supabase via
 * the existing getTrustStats() query, not hardcoded numbers.
 */
export async function DarkTrustStats() {
  const stats = await getTrustStats();

  const items = [
    { value: stats.booksPublished, label: "Books published", Icon: BookIcon },
    { value: stats.authors, label: "Authors", Icon: PeopleIcon },
    { value: stats.courses, label: "Courses covered", Icon: CapIcon },
  ];

  return (
    <section className="border-b border-white/[0.06] bg-white/[0.02] py-10">
      <Container>
        <dl className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/[0.06]">
          {items.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center px-4 py-4 text-center"
            >
              <Icon className="mb-3 h-6 w-6 text-gold" />
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="block font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  {formatCount(value)}
                </span>
                <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5v-15Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v18h6.5a1.5 1.5 0 0 0 1.5-1.5v-15Z" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8.5" cy="7.5" r="3" />
      <path d="M2.5 20c0-3.6 2.7-6 6-6s6 2.4 6 6" />
      <path d="M14.5 5a3 3 0 0 1 0 5.8" />
      <path d="M16.5 14.3c2.4.5 4 2.6 4 5.7" />
    </svg>
  );
}

function CapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 4 10 4.5-10 4.5-10-4.5L12 4Z" />
      <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
      <path d="M21 8.5v6" />
    </svg>
  );
}
