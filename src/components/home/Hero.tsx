import Image from "next/image";
import { Container } from "@/components/ui/Container";

/**
 * Section 2 — Hero: full-width image with an overlaid two-tone headline
 * and subtext (spec §4). A neutral scrim keeps the text legible without
 * any colored gradient.
 */
export function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[66vh] min-h-[460px] w-full overflow-hidden sm:h-[72vh]">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80"
          alt="Publish With Vaishu — shelves of academic books and University of Madras syllabus titles"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Neutral scrim for legibility — not a colored gradient. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />

        <div className="absolute inset-0 flex items-end pb-10 sm:items-center sm:pb-0">
          <Container>
            <div className="max-w-2xl">
              <h1 className="text-balance font-semibold tracking-tight text-white">
                <span className="block text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
                  Academic books,
                </span>
                <span className="block text-4xl leading-[1.05] text-white/65 sm:text-6xl lg:text-7xl">
                  done right.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                A publishing house for University of Madras syllabus titles —
                printed with care, written by the faculty who teach them.
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
