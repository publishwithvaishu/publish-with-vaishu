import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/** Section 3 — Primary CTA: solid black pill leading to the catalog. */
export function ExploreCTA() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="max-w-lg text-balance font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
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
