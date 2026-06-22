import { Container } from "@/components/ui/Container";

/**
 * Section 5 — Search bar. A plain GET form to /books so it works without
 * JavaScript; the catalog route consumes ?q= in a later milestone.
 */
export function SearchBar() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <form action="/books" method="get" role="search" className="mx-auto max-w-xl">
          <label htmlFor="site-search" className="sr-only">
            Search books
          </label>
          <div className="flex items-center gap-2 rounded-full border border-hairline bg-bg px-4 py-1.5 focus-within:border-ink">
            <SearchIcon />
            <input
              id="site-search"
              name="q"
              type="search"
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
      </Container>
    </section>
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
