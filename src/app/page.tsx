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
        <ExploreCTA />
        <TrustStats />
        <SearchBar />
        <CategoryChips />

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
