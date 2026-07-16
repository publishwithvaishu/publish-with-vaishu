import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getHomeAuthors } from "@/lib/queries";

/**
 * Our Authors — same live data as before (getHomeAuthors: active individual
 * authors + live book counts through book_authors), restyled as dark cards.
 */
export async function DarkAuthors() {
  const authors = await getHomeAuthors();
  if (authors.length === 0) return null;

  return (
    <section className="pt-14">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Our Authors
            </h2>
            <p className="mt-1 text-sm text-muted">
              Faculty from University of Madras affiliated colleges.
            </p>
          </div>
          <Link
            href="/books"
            className="shrink-0 text-sm font-medium text-gold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="-mx-5 mt-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {authors.map((a) => (
            <Link
              key={a.id}
              href={`/books?q=${encodeURIComponent(a.name)}`}
              className="card-dark w-[200px] shrink-0 rounded-2xl p-5 text-center"
            >
              {a.photo && !a.photo.includes("placehold.co") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.photo}
                  alt={a.name}
                  className="mx-auto h-20 w-20 rounded-full border-2 border-[#e8b647]/40 object-cover"
                />
              ) : (
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e8b647]/30 bg-white/5 font-serif text-2xl text-gold">
                  {a.name
                    .split(/\s+/)
                    .filter((w) => /[a-z]/i.test(w))
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </span>
              )}
              <h3 className="mt-3.5 line-clamp-1 text-sm font-semibold text-ink">
                {a.name}
              </h3>
              {a.designation && (
                <p className="mt-1 line-clamp-1 text-[11px] uppercase tracking-wide text-muted">
                  {a.designation}
                </p>
              )}
              {a.college && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{a.college}</p>
              )}
              <span className="mt-3 inline-block rounded-full border border-[#e8b647]/40 px-3 py-1 text-[11px] font-semibold text-gold">
                {a.book_count} {a.book_count === 1 ? "Book" : "Books"} Published
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
