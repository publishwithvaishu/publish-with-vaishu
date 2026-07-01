import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Publish With Vaishu is an academic publishing house for University of Madras syllabus titles and research publications.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              About Publish With Vaishu
            </h1>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
              <p>
                Publish With Vaishu is a single-publisher academic house
                dedicated to University of Madras syllabus titles and research
                publications. We work directly with faculty authors to bring
                accurate, syllabus-aligned textbooks to students across
                commerce, management and computer applications programmes.
              </p>
              <p>
                Every book listed here is a physical print edition, curated for
                a specific course and semester. We focus on doing one thing
                well: reliable academic titles, fairly priced, delivered across
                India.
              </p>
              <p>
                Based in Chennai, India, we continue to expand our catalogue
                each academic year in step with the university syllabus.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
