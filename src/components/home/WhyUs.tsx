import { Container } from "@/components/ui/Container";

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
    <section className="border-y border-hairline bg-bg-secondary py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <span className="eyebrow">Why students choose us</span>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            A publisher, not a marketplace
          </h2>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-12 sm:mt-16 sm:grid-cols-3">
          {points.map((point, i) => (
            <div key={point.title} className="text-center sm:text-left">
              <span
                aria-hidden
                className="font-serif text-3xl font-medium text-ink/30"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mx-auto mt-4 block h-px w-8 bg-ink/25 sm:mx-0" aria-hidden />
              <h3 className="mt-5 font-serif text-xl font-medium leading-snug text-ink">
                {point.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
