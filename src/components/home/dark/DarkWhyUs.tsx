import { Container } from "@/components/ui/Container";

/** Three short trust points, restyled from the original (orphaned) WhyUs.tsx. */
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

export function DarkWhyUs() {
  return (
    <section className="py-14">
      <Container>
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Why students choose us
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            A publisher, not a marketplace
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {points.map((point, i) => (
            <div key={point.title} className="card-dark rounded-2xl p-6 text-center sm:text-left">
              <span aria-hidden className="font-serif text-3xl font-medium text-gold/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-ink">
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
