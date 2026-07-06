import { Container } from "@/components/ui/Container";
import { formatCount } from "@/lib/format";
import { getTrustStats } from "@/lib/queries";

/**
 * Section 4 — Trust statistics: Books · Authors · Courses.
 * Live counts from the Supabase catalog (no hardcoded or placeholder
 * figures). Any stat with a zero count is hidden until real data exists.
 */
export async function TrustStats() {
  const stats = await getTrustStats();

  const items = [
    { value: stats.booksPublished, label: "Books published" },
    { value: stats.authors, label: "Authors" },
    { value: stats.courses, label: "Courses covered" },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <section className="pb-4">
      <Container>
        <dl className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-hairline border-y border-hairline">
          {items.map((item) => (
            <div key={item.label} className="px-4 py-8 text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  {formatCount(item.value)}
                </span>
                <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
