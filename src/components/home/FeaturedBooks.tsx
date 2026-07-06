import { Container } from "@/components/ui/Container";
import { BookCard } from "@/components/ui/BookCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedBooks } from "@/lib/queries";

/**
 * Section 8 — Featured books: exactly 4 hand-picked titles in a responsive
 * grid, with a "View all books" button to the full catalogue.
 */
export async function FeaturedBooks() {
  const books = await getFeaturedBooks(4);
  if (books.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6 border-b border-hairline pb-6">
          <div>
            <span className="eyebrow">The collection</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Featured books
            </h2>
          </div>
          <span className="hidden max-w-xs text-right text-sm text-muted sm:block">
            Hand-picked titles from our latest catalogue.
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/books" variant="outline" size="lg">
            View all books
          </Button>
        </div>
      </Container>
    </section>
  );
}
