import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { formatPrice } from "@/lib/format";
import type { BookWithRelations } from "@/lib/types";

/**
 * Book card: large cover, minimal text beneath (title, author, price).
 * No heavy borders or shadows — cover sits on open whitespace (spec §4).
 * Subtle lift on hover.
 */
export function BookCard({ book }: { book: BookWithRelations }) {
  const outOfStock = book.stock <= 0;

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-hairline bg-bg-secondary card-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-200 group-hover:card-hover">
        <BookCover
          title={book.title}
          coverImage={book.cover_image}
          label={book.category?.name ?? book.course}
          author={book.author?.name}
        />

        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="font-serif text-[15px] leading-snug text-ink transition-colors group-hover:text-indigo-700">
          {book.title}
        </h3>
        {book.author?.name && (
          <p className="text-sm text-muted">{book.author.name}</p>
        )}
        <p className="pt-1 text-sm font-semibold text-ink">
          {formatPrice(book.price)}
        </p>
      </div>
    </Link>
  );
}
