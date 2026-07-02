import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { BookCard } from "@/components/ui/BookCard";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { getBooks, getCategories } from "@/lib/queries";
import type { CatalogParams, SortOption } from "@/lib/types";

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

  return (
    <>
      <Header />

      <main className="pb-24 md:pb-0">
        <Container className="py-10 sm:py-14">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-2 text-muted">
              {result.total} {result.total === 1 ? "title" : "titles"}
              {activeCategory ? ` in ${activeCategory.name}` : ""}
              {q ? ` matching “${q}”` : ""}
            </p>
          </header>

          <CatalogToolbar categories={categories} />

          <div className="mt-10">
            {result.books.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
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

function EmptyState() {
  return (
    <div className="rounded-2xl border border-hairline py-20 text-center">
      <p className="font-serif text-xl text-ink">No books found</p>
      <p className="mt-2 text-muted">
        Try a different search term, course, or price range.
      </p>
    </div>
  );
}
