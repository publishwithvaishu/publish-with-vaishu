import { Container } from "@/components/ui/Container";

/**
 * Large premium search bar. A plain GET form to /books — exactly the same
 * search mechanism the existing catalog uses (?q=), no new logic. The mic
 * and scan glyphs are decorative accents from the reference design.
 */
export function DarkSearchBar() {
  return (
    <section className="pt-5">
      <Container>
        <form action="/books" method="get" role="search">
          <label htmlFor="dark-site-search" className="sr-only">
            Search books
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#141a24] py-2 pl-4 pr-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)] transition-colors focus-within:border-[#e8b647]/50">
            <SearchIcon />
            <input
              id="dark-site-search"
              name="q"
              type="search"
              placeholder="Search by title, author, ISBN or keyword…"
              autoComplete="off"
              className="h-11 w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
            />
            <span className="hidden items-center gap-1 text-muted sm:flex" aria-hidden>
              <MicIcon />
              <ScanIcon />
            </span>
            <button
              type="submit"
              className="btn-gold h-11 shrink-0 rounded-xl px-6 text-sm font-semibold tap-target"
            >
              Search
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SearchIcon() {
  return (
    <svg {...iconProps} className="shrink-0 text-muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg {...iconProps} className="mx-1.5 shrink-0">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg {...iconProps} className="mx-1.5 shrink-0">
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}
