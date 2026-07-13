import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getHomeAuthors } from "@/lib/queries";

/**
 * Our authors — a premium card grid of active authors (curated + ordered in
 * the admin), each with a portrait, designation, college, short bio and a
 * live book count. Falls back to nothing when no active authors exist.
 */
export async function AuthorsRow() {
  const authors = await getHomeAuthors();
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

        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((a) => (
            <li
              key={a.id}
              className="flex flex-col rounded-2xl border border-hairline bg-bg p-6 text-center shadow-[0_1px_2px_rgba(33,27,18,0.04)]"
            >
              {a.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.photo}
                  alt={a.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-bg-secondary font-serif text-2xl text-ink/40">
                  {a.name.charAt(0)}
                </div>
              )}

              <h3 className="mt-4 font-serif text-lg font-medium text-ink">
                {a.name}
              </h3>
              {a.designation && (
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {a.designation}
                </p>
              )}
              {a.college && (
                <p className="mt-1 text-sm text-muted">{a.college}</p>
              )}
              {a.bio && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {a.bio}
                </p>
              )}

              <div className="mt-4 flex flex-col items-center gap-3 border-t border-hairline pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {a.book_count} {a.book_count === 1 ? "book" : "books"} published
                </span>
                {a.book_count > 0 && (
                  <Link
                    href={`/books?q=${encodeURIComponent(a.name)}`}
                    className="text-sm font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
                  >
                    View books
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
