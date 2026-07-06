import { Container } from "@/components/ui/Container";
import { BookCard } from "@/components/ui/BookCard";
import { getPrescribedTitles } from "@/lib/queries";

/**
 * Section 7 — University of Madras prescribed titles.
 * Horizontally scrollable row (premium publisher feel on mobile).
 */
export async function PrescribedTitles() {
  const books = await getPrescribedTitles();
  if (books.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Prescribed by the university</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              University of Madras
              <span className="block italic text-muted">prescribed titles</span>
            </h2>
          </div>
        </div>
      </Container>

      <div className="mt-7">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-40 shrink-0 snap-start sm:w-48"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
