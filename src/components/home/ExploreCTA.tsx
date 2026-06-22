import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/** Section 3 — Primary CTA: solid black pill leading to the catalog. */
export function ExploreCTA() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="max-w-md text-balance text-lg text-muted">
            Every title on our shelves, ready to ship to your doorstep.
          </p>
          <Button href="/books" size="lg" className="mt-5">
            Explore books
          </Button>
        </div>
      </Container>
    </section>
  );
}
