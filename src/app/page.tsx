import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ExploreCTA } from "@/components/home/ExploreCTA";
import { TrustStats } from "@/components/home/TrustStats";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryChips } from "@/components/home/CategoryChips";
import { PrescribedTitles } from "@/components/home/PrescribedTitles";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { WhyUs } from "@/components/home/WhyUs";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { SectionDivider } from "@/components/ui/SectionDivider";

// Homepage reads live data per request from Supabase.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* 1 — Header */}
      <Header />

      <main className="pb-24 md:pb-0">
        {/* 2 — Hero */}
        <Hero />
        {/* 3 — Explore Books CTA */}
        <ExploreCTA />
        {/* 4 — Trust statistics */}
        <TrustStats />

        <SectionDivider />

        {/* 5 — Search bar */}
        <SearchBar />

        <SectionDivider />

        {/* 6 — Browse by course */}
        <CategoryChips />

        <SectionDivider />

        {/* 7 — University of Madras prescribed titles */}
        <PrescribedTitles />

        <SectionDivider />

        {/* 8 — Featured books */}
        <FeaturedBooks />

        <SectionDivider />

        {/* 9 — Why students choose us */}
        <WhyUs />
      </main>

      {/* 10 — Footer */}
      <Footer />

      {/* Mobile bottom navigation */}
      <MobileNav />
    </>
  );
}
