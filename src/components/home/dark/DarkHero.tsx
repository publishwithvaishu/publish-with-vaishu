import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Above-the-fold brand hero, restyled from the original (now-orphaned)
 * Hero.tsx for the dark theme. Same editorial full-bleed-photo treatment,
 * dark navy scrim instead of the old warm one, gold CTA + glass CTA.
 */
export function DarkHero() {
  return (
    <section className="relative">
      <div className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80"
          alt="Publish With Vaishu — shelves of academic books and University of Madras syllabus titles"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f16]/95 via-[#0b0f16]/55 to-[#0b0f16]/25" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />

        <div className="absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0">
          <Container>
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                Publish With Vaishu · Chennai
              </span>
              <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
                Empowering Authors.
                <span className="block italic text-[#e8b647]">
                  Enriching Minds.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                A publishing house for University of Madras syllabus titles —
                printed with care, written by the faculty who teach them.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/books"
                  className="btn-gold inline-flex h-12 items-center rounded-xl px-6 text-sm font-semibold tap-target"
                >
                  Browse Books
                </Link>
                <Link
                  href="/services"
                  className="glass-dark inline-flex h-12 items-center rounded-xl px-6 text-sm font-semibold text-ink transition-colors hover:border-[#e8b647]/40"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
