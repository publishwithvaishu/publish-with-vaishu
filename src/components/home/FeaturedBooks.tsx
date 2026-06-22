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
    <section className="py-10 sm:py-12">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Featured books
        </h2>
        <p className="mt-2 text-muted">Hand-picked titles from our latest catalogue.</p>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/books" variant="outline" size="lg">
            View all books
          </Button>
        </div>
      </Container>
    </section>
  );
}
