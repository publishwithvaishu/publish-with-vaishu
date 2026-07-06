import Image from "next/image";
import { Container } from "@/components/ui/Container";

/**
 * About the publisher — a short editorial statement paired with a warm
 * photograph. Presentational; introduces the house's mission.
 */
export function AboutPublisher() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="group relative order-last aspect-[4/5] w-full overflow-hidden rounded-sm border border-hairline lg:order-first">
            <Image
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1100&q=80"
              alt="A reader with an open academic book"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="img-zoom object-cover"
            />
          </div>

          <div>
            <span className="eyebrow">Our house</span>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Publishing for the students of Tamil Nadu.
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
              <p>
                Publish With Vaishu is a Chennai-based academic publishing house
                built on a single idea — that a textbook should match the
                syllabus a student is actually taught, and be affordable enough
                for every student to own.
              </p>
              <p>
                We work directly with University of Madras faculty to bring
                accurate, exam-ready titles across commerce, management and the
                arts to print, then deliver them to students across the state.
              </p>
            </div>
            <p className="mt-8 font-serif text-xl italic text-ink">
              — Publish With Vaishu
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
