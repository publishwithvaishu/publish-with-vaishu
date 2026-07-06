import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ExploreCTA } from "@/components/home/ExploreCTA";
import { TrustStats } from "@/components/home/TrustStats";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryChips } from "@/components/home/CategoryChips";
import { PrescribedTitles } from "@/components/home/PrescribedTitles";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { AboutPublisher } from "@/components/home/AboutPublisher";
import { CoursePanels } from "@/components/home/CoursePanels";
import { WhyUs } from "@/components/home/WhyUs";
import { GallerySection } from "@/components/home/GallerySection";
import { AuthorsRow } from "@/components/home/AuthorsRow";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Reveal } from "@/components/ui/Reveal";

// Homepage reads live data per request from Supabase.
export const dynamic = "force-dynamic";

export default function HomePage() {
  // `theme-warm` scopes the premium cream/ivory/black publishing theme to the
  // home page only — every other page keeps its existing look untouched.
  return (
    <div className="theme-warm min-h-screen bg-canvas">
      <Header />

      <main className="pb-24 md:pb-0">
        <Hero />

        <div className="relative overflow-hidden">
          {/* Watermark photo behind the promise/stats/search block so it
              doesn't read as flat empty cream. Sepia-toned (matches the warm
              palette better than plain grayscale) at low opacity so text
              stays fully legible. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521123845560-14093637aa7d?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-[0.14] [filter:sepia(0.6)_saturate(1.3)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/30 via-canvas/65 to-canvas"
          />

          {/* Small ornamental divider bridging the hero into this block. */}
          <div
            aria-hidden="true"
            className="relative flex items-center justify-center gap-3 pt-10"
          >
            <span className="h-px w-10 bg-ink/20" />
            <span className="h-1.5 w-1.5 rotate-45 bg-ink/30" />
            <span className="h-px w-10 bg-ink/20" />
          </div>

          <Reveal>
            <ExploreCTA />
          </Reveal>
          <Reveal>
            <TrustStats />
          </Reveal>
          <Reveal>
            <SearchBar />
          </Reveal>
        </div>
        <Reveal>
          <CategoryChips />
        </Reveal>

        <Reveal>
          <PrescribedTitles />
        </Reveal>
        <Reveal>
          <FeaturedBooks />
        </Reveal>
        <Reveal>
          <AboutPublisher />
        </Reveal>
        <Reveal>
          <CoursePanels />
        </Reveal>
        <Reveal>
          <WhyUs />
        </Reveal>
        <Reveal>
          <GallerySection />
        </Reveal>
        <Reveal>
          <AuthorsRow />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal>
          <FAQ />
        </Reveal>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
