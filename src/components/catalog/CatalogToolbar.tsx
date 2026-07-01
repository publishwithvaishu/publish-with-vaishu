"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import type { Category, SortOption } from "@/lib/types";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
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

  const isAll = currentCategory === "";

  return (
    <div className={cn("space-y-5", isPending && "opacity-60")}>
      {/* Search */}
      <form onSubmit={onSearchSubmit} role="search">
        <label htmlFor="catalog-search" className="sr-only">
          Search books
        </label>
        <div className="flex items-center gap-2 rounded-full border border-hairline bg-bg px-4 py-1.5 focus-within:border-ink">
          <SearchIcon />
          <input
            id="catalog-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author or ISBN"
            autoComplete="off"
            className="h-11 w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white tap-target"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category chips */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={isAll} onClick={() => navigate({ category: null })}>
          All books
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={currentCategory === c.slug}
            onClick={() => navigate({ category: c.slug })}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {/* Price + sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            className="h-11 rounded-full border border-hairline px-4 text-sm font-medium text-ink hover:bg-bg-secondary tap-target"
          >
            Apply
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-muted">
            Sort
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => navigate({ sort: e.target.value })}
            className="h-11 rounded-full border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none tap-target"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
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
          ? "border-primary bg-primary text-white card-soft"
          : "border-hairline bg-bg text-ink hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
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
        className="h-11 w-24 rounded-full border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
