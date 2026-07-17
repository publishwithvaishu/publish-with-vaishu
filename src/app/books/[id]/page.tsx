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
import { StarRating } from "@/components/book/StarRating";
import { ReviewsSection } from "@/components/book/ReviewsSection";
import {
  getBookById,
  getRelatedBooks,
  getBookImages,
  getBookRatingSummary,
} from "@/lib/queries";
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

  const authorNames = book.authors.map((a) => a.name).join(", ");
  const description =
    book.description?.slice(0, 200) ??
    `${book.title}${authorNames ? ` by ${authorNames}` : ""} — available at Publish With Vaishu.`;
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

  const [related, galleryImages, ratingSummary] = await Promise.all([
    getRelatedBooks(book.category_id, book.id),
    getBookImages(book.id),
    getBookRatingSummary(book.id),
  ]);
  const inStock = book.stock > 0;
  const authorNamesJoined = book.authors.map((a) => a.name).join(", ");

  // Primary cover + any additional gallery photos (e.g. back cover), real
  // images only. A book with just the one existing cover renders exactly as
  // before — the gallery only kicks in once there's more than one photo.
  const galleryUrls = [
    ...(isRealImage(book.cover_image) ? [book.cover_image] : []),
    ...galleryImages.map((img) => img.url).filter(isRealImage),
  ];

  // Structured data for the book (Google rich results for products/books).
  const canonicalUrl = `${getSiteUrl()}/books/${book.id}`;
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.subtitle ? { alternateName: book.subtitle } : {}),
    ...(book.authors.length === 1
      ? { author: { "@type": "Person", name: book.authors[0].name } }
      : book.authors.length > 1
        ? {
            author: book.authors.map((a) => ({
              "@type": "Person",
              name: a.name,
            })),
          }
        : {}),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.language ? { inLanguage: book.language } : {}),
    ...(book.pages ? { numberOfPages: book.pages } : {}),
    ...(isRealImage(book.cover_image) ? { image: book.cover_image } : {}),
    ...(book.description ? { description: book.description.slice(0, 500) } : {}),
    bookFormat: "https://schema.org/Paperback",
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: "Publish With Vaishu" },
    ...(ratingSummary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingSummary.average.toFixed(1),
            reviewCount: ratingSummary.count,
          },
        }
      : {}),
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
            {galleryUrls.length > 1 ? (
              <div className="mx-auto w-full max-w-[320px] md:mx-0">
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {galleryUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-[3/4] w-full shrink-0 snap-start overflow-hidden rounded-xl border border-hairline bg-bg-secondary"
                    >
                      <Image
                        src={url}
                        alt={`${book.title} — image ${i + 1} of ${galleryUrls.length}`}
                        fill
                        sizes="(max-width: 768px) 80vw, 360px"
                        priority={i === 0}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-muted">
                  Swipe for more photos ({galleryUrls.length})
                </p>
              </div>
            ) : (
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-xl border border-hairline bg-bg-secondary md:mx-0">
                <BookCover
                  title={book.title}
                  coverImage={book.cover_image}
                  label={book.category?.name ?? book.course}
                  author={authorNamesJoined || undefined}
                  variant="detail"
                  sizes="(max-width: 768px) 80vw, 360px"
                  priority
                />
              </div>
            )}

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

              {authorNamesJoined && (
                <p className="mt-4 text-base text-ink">
                  by <span className="font-medium">{authorNamesJoined}</span>
                </p>
              )}

              {ratingSummary.count > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating value={ratingSummary.average} size={17} />
                  <span className="text-sm font-semibold text-ink">
                    {ratingSummary.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted">
                    ({ratingSummary.count} {ratingSummary.count === 1 ? "rating" : "ratings"})
                  </span>
                </div>
              )}

              {/* Purchase card — sticks alongside the cover on desktop. */}
              <div className="card-dark mt-6 rounded-2xl p-5 md:sticky md:top-24">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl font-bold tracking-tight text-ink">
                    {formatPrice(book.price)}
                  </span>
                  <StockBadge inStock={inStock} stock={book.stock} />
                </div>

                <DeliveryChargeNote deliveryCharge={book.delivery_charge} />

                <div className="mt-6">
                  <AddToCartButtons
                    book={{
                      id: book.id,
                      title: book.title,
                      price: book.price,
                      cover_image: book.cover_image,
                      author_name: authorNamesJoined || null,
                      stock: book.stock,
                      delivery_charge: book.delivery_charge,
                    }}
                  />
                </div>
              </div>

              {/* Quick facts */}
              {facts.length > 0 && (
                <dl className="glass-dark mt-10 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl p-6 sm:grid-cols-3">
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

          {/* Written by — one block per author (a book can have 1..N). */}
          {book.authors.length > 0 && (
            <section className="mt-16 border-t border-hairline pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                {book.authors.length === 1 ? "About the author" : "Written by"}
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {book.authors.map((author) => (
                  <div
                    key={author.id}
                    className="card-dark flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:gap-6"
                  >
                    <AuthorAvatar name={author.name} photo={author.photo} />
                    <div className="max-w-2xl">
                      <p className="font-serif text-xl text-ink">
                        {author.name}
                      </p>
                      {(author.designation ||
                        author.department ||
                        author.college) && (
                        <p className="mt-1 text-sm text-muted">
                          {[author.designation, author.department, author.college]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {author.bio && (
                        <p className="mt-3 text-[15px] leading-relaxed text-muted">
                          {author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <ReviewsSection bookId={book.id} />

          {/* Related Books */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-hairline pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Related books
              </h2>
              <p className="mt-2 text-muted">
                More from {book.category?.name ?? "this course"}.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-8">
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
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
        <span className="font-medium text-emerald-300">Free delivery on this title</span>
      ) : (
        <>Delivery charge: <span className="font-medium text-ink">{formatPrice(deliveryCharge)}</span></>
      )}
    </p>
  );
}
