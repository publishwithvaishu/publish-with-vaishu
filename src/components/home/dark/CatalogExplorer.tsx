"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BookCover } from "@/components/ui/BookCover";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart/CartContext";
import { cn } from "@/lib/cn";
import type { BookWithRelations, Category } from "@/lib/types";

/**
 * Interactive storefront explorer (homepage only): category tiles, trending
 * chips, advanced filters, featured collections, sort + view toggle and the
 * book grid — all operating CLIENT-SIDE over books already fetched with the
 * existing `getBooks` query. No new APIs, no backend/search-logic changes:
 * full-text search still submits to /books, carts go through the existing
 * CartContext, and every book links to its existing /books/[id] page.
 */

type SortKey = "newest" | "price-asc" | "price-desc" | "title";
type CollectionKey = "new" | "best" | "syllabus" | "recommended" | "recent";
type Availability = "all" | "in" | "out";

interface Filters {
  priceMin: number;
  priceMax: number;
  university: string;
  authorId: string;
  categoryId: string; // department
  availability: Availability;
}

const COLLECTIONS: {
  key: CollectionKey;
  label: string;
  icon: React.ReactNode;
  tint: string;
}[] = [
  { key: "new", label: "New Arrivals", icon: <SparkleIcon />, tint: "from-sky-500/15" },
  { key: "best", label: "Best Sellers", icon: <TrophyIcon />, tint: "from-amber-500/15" },
  { key: "syllabus", label: "University Syllabus", icon: <BuildingIcon />, tint: "from-emerald-500/15" },
  { key: "recommended", label: "Recommended", icon: <StarIcon />, tint: "from-violet-500/15" },
  { key: "recent", label: "Recently Added", icon: <ClockIcon />, tint: "from-rose-500/15" },
];

export function CatalogExplorer({
  books,
  categories,
}: {
  books: BookWithRelations[]; // newest-first, from the existing getBooks query
  categories: Category[];
}) {
  const priceCeil = useMemo(
    () => Math.max(100, Math.ceil(Math.max(0, ...books.map((b) => b.price)) / 100) * 100),
    [books],
  );

  const defaultFilters: Filters = useMemo(
    () => ({
      priceMin: 0,
      priceMax: priceCeil,
      university: "",
      authorId: "",
      categoryId: "",
      availability: "all",
    }),
    [priceCeil],
  );

  const [activeCategory, setActiveCategory] = useState<string>(""); // "" = All Books
  const [collection, setCollection] = useState<CollectionKey | null>(null);
  const [draft, setDraft] = useState<Filters>(defaultFilters);
  const [applied, setApplied] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Filter options derived from the live catalog itself.
  const universities = useMemo(
    () =>
      [...new Set(books.map((b) => b.university).filter((u): u is string => !!u))].sort(),
    [books],
  );
  const authorOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of books) for (const a of b.authors) map.set(a.id, a.name);
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  // Trending chips — shortened titles of the newest real books (live data).
  const trending = useMemo(
    () =>
      books.slice(0, 6).map((b) => ({
        id: b.id,
        label: titleCase(b.title.split(/\s+/).slice(0, 3).join(" ")),
      })),
    [books],
  );

  const inCollection = (b: BookWithRelations, index: number, key: CollectionKey) => {
    switch (key) {
      case "new":
        return index < 8;
      case "best":
        return b.is_featured;
      case "syllabus":
        return !!b.university;
      case "recommended":
        return b.stock > 0 && (b.is_featured || index < 12);
      case "recent":
        return index < 12;
    }
  };

  const collectionCounts = useMemo(() => {
    const counts = {} as Record<CollectionKey, number>;
    for (const c of COLLECTIONS) {
      counts[c.key] = books.filter((b, i) => inCollection(b, i, c.key)).length;
    }
    return counts;
  }, [books]);

  const results = useMemo(() => {
    let list = books
      .map((b, index) => ({ b, index }))
      .filter(({ b }) => !activeCategory || b.category?.id === activeCategory)
      .filter(({ b, index }) => !collection || inCollection(b, index, collection))
      .filter(({ b }) => b.price >= applied.priceMin && b.price <= applied.priceMax)
      .filter(({ b }) => !applied.university || b.university === applied.university)
      .filter(({ b }) => !applied.categoryId || b.category?.id === applied.categoryId)
      .filter(
        ({ b }) => !applied.authorId || b.authors.some((a) => a.id === applied.authorId),
      )
      .filter(({ b }) =>
        applied.availability === "all"
          ? true
          : applied.availability === "in"
            ? b.stock > 0
            : b.stock <= 0,
      );

    switch (sort) {
      case "price-asc":
        list = [...list].sort((x, y) => x.b.price - y.b.price);
        break;
      case "price-desc":
        list = [...list].sort((x, y) => y.b.price - x.b.price);
        break;
      case "title":
        list = [...list].sort((x, y) => x.b.title.localeCompare(y.b.title));
        break;
      default:
        break; // newest — server order
    }
    return list.map(({ b }) => b);
  }, [books, activeCategory, collection, applied, sort]);

  const gridHeading =
    COLLECTIONS.find((c) => c.key === collection)?.label ??
    categories.find((c) => c.id === activeCategory)?.name ??
    "All Books";

  return (
    <>
      {/* ------------------------------------------------ Explore Categories */}
      <section className="border-b border-white/[0.06] bg-white/[0.02] py-9">
        <Container>
          <SectionHead title="Explore Categories" href="/books" />
          <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] lg:gap-4 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CategoryTile
              label="All Books"
              active={!activeCategory}
              accent="#e8b647"
              icon={<BookIcon />}
              onClick={() => {
                setActiveCategory("");
                setCollection(null);
              }}
            />
            {categories.map((c) => {
              const meta = categoryMeta(c.slug);
              return (
                <CategoryTile
                  key={c.id}
                  label={c.name}
                  active={activeCategory === c.id}
                  accent={meta.accent}
                  icon={meta.icon}
                  onClick={() => {
                    setActiveCategory((prev) => (prev === c.id ? "" : c.id));
                    setCollection(null);
                  }}
                />
              );
            })}
            <Link
              href="/books"
              className="card-dark flex w-[104px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-2xl px-3 py-5 lg:w-auto"
            >
              <span className="text-muted">
                <DotsIcon />
              </span>
              <span className="text-xs font-medium text-muted">More</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------- Trending Searches */}
      {trending.length > 0 && (
        <section className="pt-8">
          <Container>
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Trending Searches
            </h2>
            <div className="-mx-5 mt-3.5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trending.map((t) => (
                <Link
                  key={t.id}
                  href={`/books?q=${encodeURIComponent(t.label)}`}
                  className="glass-dark flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink transition-colors hover:border-[#e8b647]/40"
                >
                  <FlameIcon />
                  {t.label}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------ Filters */}
      <section className="border-b border-white/[0.06] bg-white/[0.02] py-8">
        <Container>
          <div className="glass-dark rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg font-semibold text-ink">
                <FilterIcon /> Filters
              </span>
              <button
                type="button"
                onClick={() => {
                  setDraft(defaultFilters);
                  setApplied(defaultFilters);
                }}
                className="text-sm font-medium text-gold hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">
              {/* Price slider */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">Price Range</span>
                  <span className="font-semibold text-gold">
                    ₹{draft.priceMin} – ₹{draft.priceMax}
                    {draft.priceMax >= priceCeil ? "+" : ""}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={priceCeil}
                    step={10}
                    value={draft.priceMin}
                    aria-label="Minimum price"
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        priceMin: Math.min(Number(e.target.value), d.priceMax),
                      }))
                    }
                    className="w-full accent-[#e8b647]"
                  />
                  <input
                    type="range"
                    min={0}
                    max={priceCeil}
                    step={10}
                    value={draft.priceMax}
                    aria-label="Maximum price"
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        priceMax: Math.max(Number(e.target.value), d.priceMin),
                      }))
                    }
                    className="w-full accent-[#e8b647]"
                  />
                  <div className="flex justify-between text-xs text-muted">
                    <span>₹0</span>
                    <span>₹{priceCeil}+</span>
                  </div>
                </div>
              </div>

              <FilterSelect
                label="University"
                icon={<BuildingIcon />}
                value={draft.university}
                onChange={(v) => setDraft((d) => ({ ...d, university: v }))}
                options={[
                  { value: "", label: "All Universities" },
                  ...universities.map((u) => ({ value: u, label: u })),
                ]}
              />
              <FilterSelect
                label="Department"
                icon={<CapIcon />}
                value={draft.categoryId}
                onChange={(v) => setDraft((d) => ({ ...d, categoryId: v }))}
                options={[
                  { value: "", label: "All Departments" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
              <FilterSelect
                label="Author"
                icon={<UserIcon />}
                value={draft.authorId}
                onChange={(v) => setDraft((d) => ({ ...d, authorId: v }))}
                options={[
                  { value: "", label: "All Authors" },
                  ...authorOptions.map((a) => ({ value: a.id, label: a.name })),
                ]}
              />
              <FilterSelect
                label="Availability"
                icon={<BoxIcon />}
                value={draft.availability}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, availability: v as Availability }))
                }
                options={[
                  { value: "all", label: "All Books" },
                  { value: "in", label: "In Stock" },
                  { value: "out", label: "Out of Stock" },
                ]}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setApplied(draft)}
                className="btn-gold flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold tap-target"
              >
                <FilterIcon /> Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(defaultFilters);
                  setApplied(defaultFilters);
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e8b647]/50 px-8 text-sm font-semibold text-gold transition-colors tap-target hover:bg-[#e8b647]/10"
              >
                <ResetIcon /> Reset
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ Featured Collections */}
      <section className="border-b border-white/[0.06] bg-white/[0.02] py-10">
        <Container>
          <SectionHead title="Featured Collections" href="/books" />
          <div className="-mx-5 mt-4 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {COLLECTIONS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() =>
                  setCollection((prev) => (prev === c.key ? null : c.key))
                }
                className={cn(
                  "card-dark relative w-[168px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br to-transparent p-4 text-left lg:w-auto",
                  c.tint,
                  collection === c.key && "border-[#e8b647]/70",
                )}
              >
                <span className="text-base font-semibold leading-snug text-ink">
                  {c.label}
                </span>
                <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gold">
                  {c.icon}
                </span>
                <span className="mt-4 block text-xs text-muted">
                  {collectionCounts[c.key]}{" "}
                  {collectionCounts[c.key] === 1 ? "Book" : "Books"}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------- Results + sorting */}
      <section className="pt-8">
        <Container>
          <div className="glass-dark flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <BookIcon />
              {results.length} {results.length === 1 ? "Book" : "Books"} Found
            </span>
            <span className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted">
                Sort By:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-9 rounded-lg border border-white/10 bg-[#141a24] px-2.5 text-sm text-ink focus:border-[#e8b647]/60 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title A–Z</option>
                </select>
              </label>
              <span className="flex overflow-hidden rounded-lg border border-white/10">
                <ViewToggle active={view === "grid"} onClick={() => setView("grid")} label="Grid view">
                  <GridIcon />
                </ViewToggle>
                <ViewToggle active={view === "list"} onClick={() => setView("list")} label="List view">
                  <ListIcon />
                </ViewToggle>
              </span>
            </span>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {gridHeading}
            </h2>
            <Link href="/books" className="text-sm font-medium text-gold hover:underline">
              View All
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="card-dark mt-5 rounded-2xl px-6 py-16 text-center">
              <p className="font-serif text-lg text-ink">No books match these filters</p>
              <p className="mt-1 text-sm text-muted">
                Try clearing a filter or two.
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
              {results.map((b) => (
                <DarkBookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {results.map((b) => (
                <DarkBookRow key={b.id} book={b} />
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ cards */

function useAddToCart(book: BookWithRelations) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = book.stock <= 0;

  const add = () => {
    if (outOfStock) return;
    // Same cart item shape/logic used by the existing AddToCartButtons.
    addItem(
      {
        id: book.id,
        title: book.title,
        price: book.price,
        cover_image: book.cover_image,
        author_name: book.authors.map((a) => a.name).join(", ") || null,
        stock: book.stock,
        delivery_charge: book.delivery_charge,
      },
      1,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };
  return { add, added, outOfStock };
}

function CartAddButton({
  book,
  className,
}: {
  book: BookWithRelations;
  className?: string;
}) {
  const { add, added, outOfStock } = useAddToCart(book);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // sits inside the card's <Link>
        e.stopPropagation();
        add();
      }}
      disabled={outOfStock}
      aria-label={outOfStock ? "Out of stock" : `Add ${book.title} to cart`}
      className={cn(
        "flex h-9 w-11 items-center justify-center rounded-lg text-sm font-semibold transition-all",
        outOfStock
          ? "cursor-not-allowed border border-white/10 text-muted/50"
          : "border border-[#e8b647]/60 text-gold hover:bg-[#e8b647]/10",
        className,
      )}
    >
      {added ? <CheckIcon /> : <CartMiniIcon />}
    </button>
  );
}

function DarkBookCard({ book }: { book: BookWithRelations }) {
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
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />
        {book.stock <= 0 && (
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
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[15px] font-bold text-ink">
            {formatPrice(book.price)}
          </span>
          <CartAddButton book={book} />
        </div>
      </div>
    </Link>
  );
}

function DarkBookRow({ book }: { book: BookWithRelations }) {
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
        <CartAddButton book={book} className="mr-1 shrink-0" />
      </Link>
    </li>
  );
}

/* -------------------------------------------------------------- helpers */

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-gold hover:underline"
      >
        View All <ArrowIcon />
      </Link>
    </div>
  );
}

function CategoryTile({
  label,
  active,
  accent,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "card-dark flex w-[104px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-2xl px-3 py-5 lg:w-auto",
        active && "border-[#e8b647]/70 shadow-[0_0_22px_-8px_rgba(232,182,71,0.55)]",
      )}
    >
      <span style={{ color: accent }}>{icon}</span>
      <span
        className={cn(
          "line-clamp-1 text-xs font-medium",
          active ? "text-gold" : "text-muted",
        )}
      >
        {label}
      </span>
    </button>
  );
}

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#141a24] px-3.5 py-2.5">
      <span className="shrink-0 text-muted">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-muted">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full truncate bg-transparent text-sm font-medium text-ink focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#141a24]">
              {o.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function ViewToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-9 w-10 items-center justify-center transition-colors",
        active ? "bg-[#e8b647]/90 text-[#1a1405]" : "text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoryMeta(slug: string): { accent: string; icon: React.ReactNode } {
  const s = slug.toLowerCase().replace(/[^a-z]/g, "");
  if (s.includes("bcom")) return { accent: "#60a5fa", icon: <CapIcon size={26} /> };
  if (s.includes("bsc")) return { accent: "#4ade80", icon: <FlaskIcon /> };
  if (s.includes("bba")) return { accent: "#a78bfa", icon: <ChartIcon /> };
  if (s.includes("bca")) return { accent: "#38bdf8", icon: <LaptopIcon /> };
  if (s.includes("msc")) return { accent: "#e8b647", icon: <AtomIcon /> };
  return { accent: "#e8b647", icon: <BookIcon size={26} /> };
}

/* ------------------------------------------------------------------ icons */

function svgProps(size = 22) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function BookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...svgProps(size)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  );
}
function CapIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...svgProps(size)}>
      <path d="m12 4 10 4.5-10 4.5-10-4.5L12 4Z" />
      <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
    </svg>
  );
}
function FlaskIcon() {
  return (
    <svg {...svgProps(26)}>
      <path d="M10 3v6L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M8.5 3h7M7.5 15h9" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg {...svgProps(26)}>
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </svg>
  );
}
function LaptopIcon() {
  return (
    <svg {...svgProps(26)}>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </svg>
  );
}
function AtomIcon() {
  return (
    <svg {...svgProps(26)}>
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg {...svgProps(26)}>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg {...svgProps(15)} className="text-gold">
      <path d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-1.5.5-3 1.5-4.5C9 9 10 9.5 10.5 8.5 11.5 6.5 12 3 12 3Z" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg {...svgProps(18)}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg {...svgProps(17)}>
      <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg {...svgProps(20)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg {...svgProps(20)}>
      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
      <path d="M9 12h1M14 12h1M9 16h1M14 16h1" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg {...svgProps(20)}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg {...svgProps(22)}>
      <path d="M12 3 13.8 9 20 10.5 13.8 12 12 18l-1.8-6L4 10.5 10.2 9 12 3Z" />
      <path d="M19 16.5v4M17 18.5h4" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg {...svgProps(22)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M10 18h4" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg {...svgProps(22)}>
      <path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg {...svgProps(22)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...svgProps(16)}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg {...svgProps(16)}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CartMiniIcon() {
  return (
    <svg {...svgProps(17)}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...svgProps(17)}>
      <path d="M5 12.5l4 4 10-10" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg {...svgProps(15)}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}
