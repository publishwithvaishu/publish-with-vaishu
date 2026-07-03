import { Container } from "@/components/ui/Container";
import { accentAt } from "@/lib/accents";

/**
 * Section 9 — Why students choose us: three short trust points.
 * Typography only — no icons, no boxes (spec §4).
 */
const points = [
  {
    title: "Syllabus-aligned.",
    body: "Every title maps exactly to the current University of Madras syllabus, unit by unit — study what will actually be examined, nothing extra.",
  },
  {
    title: "Written by faculty.",
    body: "Authored by the professors who teach these very papers, so explanations follow the way topics are taught and asked in exams.",
  },
  {
    title: "Delivered in 3–5 days.",
    body: "Printed to order and shipped across Tamil Nadu in 3–5 working days, with cash on delivery available at checkout.",
  },
];

export function WhyUs() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Why students choose us
        </h2>

        <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-12">
          {points.map((point, i) => {
            const accent = accentAt(i);
            return (
              <div key={point.title}>
                <span
                  aria-hidden
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${accent.chipBg} ${accent.text}`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-serif text-xl leading-snug text-ink">
                  {point.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {point.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
