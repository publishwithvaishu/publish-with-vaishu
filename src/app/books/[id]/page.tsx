import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { BookCard } from "@/components/ui/BookCard";
import { BookCover } from "@/components/ui/BookCover";
import { AddToCartButtons } from "@/components/book/AddToCartButtons";
import { getBookById, getRelatedBooks } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { pickAccent } from "@/lib/accents";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isRealImage = (url: string | null): url is string =>
  !!url && !url.includes("placehold.co");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return { title: "Book not found" };

  const book = await getBookById(id);
  if (!book) return { title: "Book not found" };

  const description =
    book.description?.slice(0, 200) ??
    `${book.title}${book.author?.name ? ` by ${book.author.name}` : ""} — available at Publish With Vaishu.`;
  const images = isRealImage(book.cover_image)
    ? [{ url: book.cover_image }]
    : undefined;

  return {
    title: book.title,
    description,
    alternates: { canonical: `/books/${id}` },
    openGraph: {
      type: "article",
      title: `${book.title} · Publish With Vaishu`,
      description,
      url: `/books/${id}`,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: `${book.title} · Publish With Vaishu`,
      description,
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const book = await getBookById(id);
  if (!book) notFound();

  const related = await getRelatedBooks(book.category_id, book.id);
  const inStock = book.stock > 0;

  // Structured data for the book (Google rich results for products/books).
  const canonicalUrl = `${getSiteUrl()}/books/${book.id}`;
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.subtitle ? { alternateName: book.subtitle } : {}),
    ...(book.author?.name
      ? { author: { "@type": "Person", name: book.author.name } }
      : {}),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.language ? { inLanguage: book.language } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    ...(isRealImage(book.cover_image) ? { image: book.cover_image } : {}),
    ...(book.description ? { description: book.description.slice(0, 500) } : {}),
    bookFormat: "https://schema.org/Paperback",
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: "Publish With Vaishu" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: book.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    },
  };

  const facts: { label: string; value: string | null }[] = [
    { label: "ISBN", value: book.isbn },
    { label: "University", value: book.university },
    { label: "Course", value: book.course },
    { label: "Semester", value: book.semester },
    { label: "Edition", value: book.edition },
    { label: "Pages", value: book.pages ? String(book.pages) : null },
    { label: "Language", value: book.language },
  ].filter((f) => f.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <Header />

      <main className="pb-24 md:pb-0">
        <Container className="py-8 sm:py-12">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            ← Back to books
          </Link>

          {/* Hero: cover + key info */}
          <div className="mt-6 grid gap-8 sm:gap-12 md:grid-cols-[minmax(0,360px)_1fr]">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-xl border border-hairline bg-bg-secondary md:mx-0">
              <BookCover
                title={book.title}
                coverImage={book.cover_image}
                label={book.category?.name ?? book.course}
                author={book.author?.name}
                variant="detail"
                sizes="(max-width: 768px) 80vw, 360px"
                priority
              />
            </div>

            <div>
              {book.category && (
                <Link
                  href={`/books?category=${book.category.slug}`}
                  className={(() => {
                    const a = pickAccent(book.category.name);
                    return `inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium hover:brightness-[0.98] ${a.bg} ${a.border} ${a.text}`;
                  })()}
                >
                  {book.category.name}
                </Link>
              )}

              <h1 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-2 text-lg text-muted">{book.subtitle}</p>
              )}

              {book.author?.name && (
                <p className="mt-4 text-base text-ink">
                  by <span className="font-medium">{book.author.name}</span>
                </p>
              )}

              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-semibold tracking-tight text-ink">
                  {formatPrice(book.price)}
                </span>
                <StockBadge inStock={inStock} stock={book.stock} />
              </div>

              <DeliveryChargeNote deliveryCharge={book.delivery_charge} />

              <div className="mt-8 max-w-md">
                <AddToCartButtons
                  book={{
                    id: book.id,
                    title: book.title,
                    price: book.price,
                    cover_image: book.cover_image,
                    author_name: book.author?.name ?? null,
                    stock: book.stock,
                    delivery_charge: book.delivery_charge,
                  }}
                />
              </div>

              {/* Quick facts */}
              {facts.length > 0 && (
                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-6 sm:grid-cols-3">
                  {facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs uppercase tracking-wide text-muted">
                        {f.label}
                      </dt>
                      <dd className="mt-1 text-sm text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          {/* Book Information */}
          {book.description && (
            <section className="mt-16 border-t border-hairline pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Book information
              </h2>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-muted">
                {book.description}
              </p>
            </section>
          )}

          {/* About Author */}
          {book.author && (
            <section className="mt-16 border-t border-hairline pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                About the author
              </h2>
              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-7">
                <AuthorAvatar
                  name={book.author.name}
                  photo={book.author.photo}
                />
                <div className="max-w-2xl">
                  <p className="font-serif text-xl text-ink">
                    {book.author.name}
                  </p>
                  {(book.author.designation ||
                    book.author.department ||
                    book.author.college) && (
                    <p className="mt-1 text-sm text-muted">
                      {[
                        book.author.designation,
                        book.author.department,
                        book.author.college,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {book.author.bio && (
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">
                      {book.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Related Books */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-hairline pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Related books
              </h2>
              <p className="mt-2 text-muted">
                More from {book.category?.name ?? "this course"}.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                {related.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}

function AuthorAvatar({
  name,
  photo,
}: {
  name: string;
  photo: string | null;
}) {
  const isRealPhoto = photo && !photo.includes("placehold.co");
  const initials = name
    .split(/\s+/)
    .filter((w) => /[a-z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-hairline bg-bg-secondary">
      {isRealPhoto ? (
        <Image src={photo} alt={name} fill sizes="80px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-serif text-xl text-ink">
          {initials || "·"}
        </span>
      )}
    </div>
  );
}

function StockBadge({ inStock, stock }: { inStock: boolean; stock: number }) {
  if (!inStock) {
    return (
      <span className="inline-flex items-center rounded-full bg-bg-secondary px-3 py-1 text-sm font-medium text-muted">
        Out of stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden />
      In stock
      {stock <= 5 ? ` — only ${stock} left` : ""}
    </span>
  );
}

/**
 * Shows the admin's manual delivery charge for this book, when set.
 * null (not set) -> nothing shown; the site default rule applies silently.
 */
function DeliveryChargeNote({ deliveryCharge }: { deliveryCharge: number | null }) {
  if (deliveryCharge === null) return null;
  return (
    <p className="mt-3 text-sm text-muted">
      {deliveryCharge === 0 ? (
        <span className="font-medium text-emerald-700">Free delivery on this title</span>
      ) : (
        <>Delivery charge: <span className="font-medium text-ink">{formatPrice(deliveryCharge)}</span></>
      )}
    </p>
  );
}
