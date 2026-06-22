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
    <section className="py-4">
      <Container>
        <dl className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {formatCount(item.value)}
                </span>
                <span className="mt-1 block text-xs text-muted sm:text-sm">
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
