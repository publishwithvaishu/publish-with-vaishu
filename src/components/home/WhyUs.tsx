import { Container } from "@/components/ui/Container";

/**
 * Section 9 — Why students choose us: three short trust points.
 * Typography only — no icons, no boxes (spec §4).
 */
const points = [
  {
    title: "Written by the faculty who teach it.",
    body: "Every title is authored by professors and researchers from University of Madras affiliated colleges — aligned to the exact syllabus you study.",
  },
  {
    title: "Printed, not downloaded.",
    body: "We publish physical books built to last a semester of underlining, dog-earing and re-reading. No screens, no logins, no eBooks.",
  },
  {
    title: "Delivered to your doorstep.",
    body: "Order online, pay securely, and track your shipment from our press to your hostel room or home address.",
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
          {points.map((point) => (
            <div key={point.title}>
              <h3 className="font-serif text-xl leading-snug text-ink">
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
