import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { BookCard } from "@/components/ui/BookCard";
import { BookCover } from "@/components/ui/BookCover";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { getBooks, getCategories } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import type { BookWithRelations, CatalogParams, SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

const BOOKS_DESCRIPTION =
  "Browse and buy academic books from Publish With Vaishu — University of Madras syllabus titles (B.Com, BBA, BCA, M.Sc). Search by title, author or ISBN, filter by course and price, delivered across India.";

export const metadata: Metadata = {
  title: "Books — Academic Titles & Textbooks",
  description: BOOKS_DESCRIPTION,
  alternates: { canonical: "/books" },
  keywords: [
    "academic books",
    "textbooks",
    "University of Madras books",
    "book publishing India",
    "buy academic books online",
    "Publish With Vaishu",
  ],
  openGraph: {
    title: "Books · Publish With Vaishu",
    description: BOOKS_DESCRIPTION,
    url: "/books",
  },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const toNumber = (v: string | undefined) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default async function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const q = first(sp.q)?.trim() || undefined;
  const category = first(sp.category) || undefined;
  const minPrice = toNumber(first(sp.min));
  const maxPrice = toNumber(first(sp.max));
  const sortRaw = first(sp.sort);
  const sort: SortOption =
    sortRaw === "price-asc" || sortRaw === "price-desc" ? sortRaw : "newest";
  const page = Math.max(1, toNumber(first(sp.page)) ?? 1);
  // Presentational only — grid (default) or list rendering of the same result.
  const view = first(sp.view) === "list" ? "list" : "grid";

  const params: CatalogParams = {
    q,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
  };

  const [result, categories] = await Promise.all([
    getBooks(params),
    getCategories(),
  ]);

  // Heading reflects the active category (if any).
  const activeCategory = category
    ? categories.find((c) => normalizeSlug(c.slug) === normalizeSlug(category))
    : undefined;
  const heading = activeCategory ? activeCategory.name : "All books";

  // Base query for pagination links (everything except `page`).
  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;
  if (category) baseQuery.category = category;
  if (minPrice !== undefined) baseQuery.min = String(minPrice);
  if (maxPrice !== undefined) baseQuery.max = String(maxPrice);
  if (sort !== "newest") baseQuery.sort = sort;
  if (view === "list") baseQuery.view = view;

  return (
    <>
      <Header />

      <main className="pb-28 md:pb-4">
        <Container className="py-10 sm:py-14">
          {/* Hero heading */}
          <header className="mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              The Collection
            </span>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {heading}
            </h1>
            <p className="mt-3 text-muted">
              {result.total} {result.total === 1 ? "title" : "titles"}
              {activeCategory ? ` in ${activeCategory.name}` : ""}
              {q ? ` matching “${q}”` : ""}
            </p>
          </header>

          <CatalogToolbar categories={categories} />

          <div className="mt-8">
            {result.books.length === 0 ? (
              <EmptyState hasQuery={!!q} />
            ) : view === "list" ? (
              <ul className="space-y-3">
                {result.books.map((book) => (
                  <BookRow key={book.id} book={book} />
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                {result.books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            baseQuery={baseQuery}
          />
        </Container>
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}

/** Compact list row — same data/link as BookCard, horizontal layout. */
function BookRow({ book }: { book: BookWithRelations }) {
  const authorNames = book.authors.map((a) => a.name).join(", ");
  return (
    <li>
      <Link
        href={`/books/${book.id}`}
        className="card-dark flex items-center gap-4 rounded-2xl p-3"
      >
        <div className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-lg bg-[#0f141d]">
          <BookCover
            title={book.title}
            coverImage={book.cover_image}
            variant="mini"
            sizes="68px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-ink">
            {book.title}
          </h3>
          {authorNames && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">{authorNames}</p>
          )}
          <p className="mt-1.5 text-[15px] font-bold text-ink">
            {formatPrice(book.price)}
          </p>
        </div>
        {book.stock <= 0 && (
          <span className="mr-2 shrink-0 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-muted">
            Out of stock
          </span>
        )}
      </Link>
    </li>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="card-dark rounded-2xl px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gold">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <p className="mt-5 font-serif text-xl text-ink">No books found</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        {hasQuery
          ? "We couldn’t find a match for that search. Try a different title, author or ISBN."
          : "Try a different course or price range."}
      </p>
      <Link
        href="/books"
        className="btn-gold mt-6 inline-flex h-11 items-center rounded-xl px-6 text-sm font-semibold"
      >
        Clear filters
      </Link>
    </div>
  );
}
