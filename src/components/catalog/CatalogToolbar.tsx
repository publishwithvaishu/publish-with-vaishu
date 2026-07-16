"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { pickAccent } from "@/lib/accents";
import type { Category, SortOption } from "@/lib/types";

/**
 * Catalog toolbar — premium search, category chips, price filter, sort and
 * grid/list view toggle, wrapped in the homepage's glass filter card.
 * Filter/search/sort logic is unchanged: every control still just merges
 * params into the URL and lets the existing server query run as before.
 */
const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogToolbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = params.get("category") ?? "";
  const currentSort = (params.get("sort") as SortOption) || "newest";
  const currentView = params.get("view") === "list" ? "list" : "grid";
  const [q, setQ] = useState(params.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("max") ?? "");

  // Merge updates into the current query string. Any filter change resets page.
  function navigate(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in updates)) next.delete("page");
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: q.trim() || null, min: minPrice || null, max: maxPrice || null });
  }

  function resetAll() {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.push(pathname));
  }

  const isAll = currentCategory === "";

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}>
      {/* Premium search — same shape as the homepage search bar. */}
      <form onSubmit={onSearchSubmit} role="search">
        <label htmlFor="catalog-search" className="sr-only">
          Search books
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#141a24] py-2 pl-4 pr-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)] transition-colors focus-within:border-[#e8b647]/50">
          <SearchIcon />
          <input
            id="catalog-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author, ISBN or keyword…"
            autoComplete="off"
            className="h-11 w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="btn-gold h-11 shrink-0 rounded-xl px-6 text-sm font-semibold tap-target"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category chips */}
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={isAll} onClick={() => navigate({ category: null })}>
          All books
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={currentCategory === c.slug}
            onClick={() => navigate({ category: c.slug })}
            accentClasses={(() => {
              const a = pickAccent(c.name);
              return `${a.bg} ${a.border} ${a.text}`;
            })()}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {/* Filter card — price, sort, view */}
      <div className="glass-dark rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <FilterIcon /> Filters
          </span>
          <button
            type="button"
            onClick={resetAll}
            className="text-sm font-medium text-gold hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form
            onSubmit={onSearchSubmit}
            className="flex items-end gap-2"
            aria-label="Filter by price"
          >
            <PriceField
              id="min-price"
              label="Min ₹"
              value={minPrice}
              onChange={setMinPrice}
            />
            <PriceField
              id="max-price"
              label="Max ₹"
              value={maxPrice}
              onChange={setMaxPrice}
            />
            <button
              type="submit"
              className="btn-gold h-11 shrink-0 rounded-xl px-5 text-sm font-semibold tap-target"
            >
              Apply
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="sort" className="text-sm text-muted">
              Sort By:
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => navigate({ sort: e.target.value })}
              className="h-11 rounded-xl border border-white/10 bg-[#141a24] px-3 text-sm text-ink focus:border-[#e8b647]/60 focus:outline-none tap-target"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#141a24]">
                  {s.label}
                </option>
              ))}
            </select>

            <span className="flex overflow-hidden rounded-lg border border-white/10">
              <ViewToggle
                active={currentView === "grid"}
                onClick={() => navigate({ view: null })}
                label="Grid view"
              >
                <GridIcon />
              </ViewToggle>
              <ViewToggle
                active={currentView === "list"}
                onClick={() => navigate({ view: "list" })}
                label="List view"
              >
                <ListIcon />
              </ViewToggle>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  accentClasses,
  children,
}: {
  active: boolean;
  onClick: () => void;
  /** Optional resting tint (decorative); active state is always gold. */
  accentClasses?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 tap-target",
        active
          ? "btn-gold border-transparent"
          : accentClasses
            ? `${accentClasses} hover:brightness-125`
            : "glass-dark text-muted hover:border-[#e8b647]/40 hover:text-ink",
      )}
    >
      {children}
    </button>
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
        "flex h-11 w-11 items-center justify-center transition-colors",
        active ? "bg-[#e8b647]/90 text-[#1a1405]" : "text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function PriceField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-muted">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-24 rounded-xl border border-white/[0.08] bg-[#141a24] px-3 text-sm text-ink focus:border-[#e8b647]/60 focus:outline-none"
      />
    </div>
  );
}

function svgProps(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function SearchIcon() {
  return (
    <svg {...svgProps(20)} className="shrink-0 text-muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M4 7h16M7 12h10M10 17h4" />
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
