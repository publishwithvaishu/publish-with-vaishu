import Image from "next/image";
import { Container } from "@/components/ui/Container";

/**
 * Section 2 — Hero. Full-viewport editorial photograph with a warm scrim and
 * a large Playfair headline that floats up into place on page load — the
 * look of a premium publishing house cover. Content is unchanged; treatment
 * only.
 */
export function Hero() {
  return (
    <section className="relative">
      <div className="group relative h-screen min-h-[640px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80"
          alt="Publish With Vaishu — shelves of academic books and University of Madras syllabus titles"
          fill
          priority
          sizes="100vw"
          className="img-zoom scale-105 object-cover"
        />

        {/* Warm editorial scrim — darker at the base for legible text, fading
            into the cream canvas at the very bottom for a seamless join. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a140a]/80 via-[#1a140a]/35 to-[#1a140a]/15" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />

        <div className="absolute inset-0 flex items-end pb-16 sm:items-center sm:pb-0">
          <Container>
            <div className="max-w-2xl">
              <span
                className="hero-float block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e9dcc2]"
                style={{ animationDelay: "0ms" }}
              >
                Publish With Vaishu · Chennai
              </span>
              <span
                className="hero-float mt-5 block h-px w-14 bg-[#e9dcc2]/50"
                style={{ animationDelay: "150ms" }}
                aria-hidden
              />

              <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.02] tracking-[-0.01em] text-[#fbf6ec] sm:text-6xl lg:text-7xl">
                <span className="hero-float block" style={{ animationDelay: "250ms" }}>
                  Academic books,
                </span>
                <span
                  className="hero-float block italic text-[#e4d4b6]"
                  style={{ animationDelay: "400ms" }}
                >
                  done right.
                </span>
              </h1>
              <p
                className="hero-float mt-7 max-w-xl text-base leading-relaxed text-[#efe6d6]/90 sm:text-lg"
                style={{ animationDelay: "600ms" }}
              >
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
