import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/** Section 3 — Primary CTA: solid black pill leading to the catalog. */
export function ExploreCTA() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* Faint oversized quote mark + warm glow so the section reads as a
          designed moment rather than empty space. Purely decorative. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none font-serif text-[13rem] leading-none text-ink/[0.05] sm:text-[16rem]"
      >
        &ldquo;
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(33,27,18,0.05)_0%,_transparent_70%)]"
      />

      <Container>
        <div className="relative flex flex-col items-center text-center">
          <span className="eyebrow">Our promise</span>
          <span className="rule-hair mt-3 w-10" />
          <p className="mt-6 max-w-lg text-balance font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
            Every title on our shelves, ready to ship to your doorstep.
          </p>
          <Button href="/books" size="lg" className="mt-7">
            Explore books
          </Button>
        </div>
      </Container>
    </section>
  );
}
