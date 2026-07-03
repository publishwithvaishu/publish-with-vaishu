import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCategories, getBooks } from "@/lib/queries";
import { pickAccent } from "@/lib/accents";

/**
 * Browse by programme — large clickable panels per category with live title
 * counts. Counts are composed from the existing catalog queries
 * (getCategories + getBooks) — no new data-fetching logic. Styled with the
 * site's existing card language: rounded-2xl, hairline border, soft shadow,
 * indigo hover accents (same as BookCard).
 */
export async function CoursePanels() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  const withCounts = await Promise.all(
    categories.map(async (c) => {
      const { total } = await getBooks({ category: c.slug, page: 1, pageSize: 1 });
      return { ...c, total };
    }),
  );
  const panels = withCounts.filter((c) => c.total > 0);
  if (panels.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Browse by programme
        </h2>
        <p className="mt-2 text-muted">
          Every title, mapped to your degree and semester.
        </p>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((c) => {
            const accent = pickAccent(c.name);
            return (
              <Link
                key={c.id}
                href={`/books?category=${encodeURIComponent(c.slug)}`}
                className={`group flex min-h-[150px] flex-col justify-between rounded-2xl border p-6 card-soft transition-all duration-200 hover:card-hover ${accent.bg} ${accent.border}`}
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${accent.text}`}
                >
                  Programme
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-ink transition-colors duration-200 group-hover:text-indigo-700">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {c.total} {c.total === 1 ? "title" : "titles"} ·{" "}
                    <span className={`font-medium ${accent.text}`}>
                      View books →
                    </span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
