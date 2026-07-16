import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { formatPrice } from "@/lib/format";
import type { BookWithRelations } from "@/lib/types";

/**
 * Book card (dark luxury) — matches the homepage card language: raised dark
 * card, rounded-2xl, gold-tinted border + lift on hover, cover then title,
 * authors and price. Same props/links as before.
 */
export function BookCard({ book }: { book: BookWithRelations }) {
  const outOfStock = book.stock <= 0;
  const authorNames = book.authors.map((a) => a.name).join(", ");

  return (
    <Link
      href={`/books/${book.id}`}
      className="card-dark group flex flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0f141d]">
        <BookCover
          title={book.title}
          coverImage={book.cover_image}
          label={book.category?.name ?? book.course}
          author={authorNames || undefined}
        />

        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">
          {book.title}
        </h3>
        {authorNames && (
          <p className="line-clamp-1 text-xs text-muted">{authorNames}</p>
        )}
        <p className="mt-auto pt-2 text-[15px] font-bold text-ink">
          {formatPrice(book.price)}
        </p>
      </div>
    </Link>
  );
}
