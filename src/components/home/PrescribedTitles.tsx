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
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            University of Madras
            <span className="block text-muted">prescribed titles</span>
          </h2>
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
