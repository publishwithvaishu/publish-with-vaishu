import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCategories, getBooks } from "@/lib/queries";

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
        <div className="text-center">
          <span className="eyebrow">Programmes</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Browse by programme
          </h2>
          <p className="mt-3 text-muted">
            Every title, mapped to your degree and semester.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((c) => (
            <Link
              key={c.id}
              href={`/books?category=${encodeURIComponent(c.slug)}`}
              className="group flex min-h-[168px] flex-col justify-between rounded-sm border border-hairline bg-bg p-7 transition-all duration-300 hover:bg-ink"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:text-white/60">
                Programme
              </span>
              <div>
                <h3 className="font-serif text-2xl font-medium text-ink transition-colors duration-300 group-hover:text-white">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted transition-colors duration-300 group-hover:text-white/70">
                  {c.total} {c.total === 1 ? "title" : "titles"} · View books →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
