import { Container } from "@/components/ui/Container";
import { getBooks } from "@/lib/queries";

/**
 * Our authors — author names with live title counts, aggregated from the
 * existing catalog query (getBooks). No new data-fetching logic, plain
 * typography per the site's existing language.
 */
export async function AuthorsRow() {
  const { books } = await getBooks({ page: 1, pageSize: 100 });

  const counts = new Map<string, number>();
  for (const b of books) {
    const name = b.author?.name;
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const authors = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 9);
  if (authors.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="text-center">
          <span className="eyebrow">The faculty</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Our authors
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Faculty from University of Madras affiliated colleges — writing the
            papers they teach.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl gap-x-14 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map(([name, n]) => (
            <li
              key={name}
              className="flex items-baseline justify-between gap-4 border-b border-hairline pb-4"
            >
              <span className="font-serif text-lg font-medium text-ink">
                {name}
              </span>
              <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-muted">
                {n} {n === 1 ? "title" : "titles"}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
