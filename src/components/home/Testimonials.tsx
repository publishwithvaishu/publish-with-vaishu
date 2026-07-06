import { Container } from "@/components/ui/Container";

/* TODO: replace with real testimonials — the quotes below are placeholder
   copy written to show layout only. Swap in genuine student quotes (with
   permission) before pushing live. */
const quotes = [
  {
    quote:
      "The B.Com books matched our semester syllabus exactly — no wasted chapters, everything I needed for the exam.",
    name: "Student, B.Com",
    college: "Chennai",
  },
  {
    quote:
      "Ordered on a Monday, had it by Thursday with cash on delivery. The easiest way I've found to get my textbooks.",
    name: "Student, BBA",
    college: "Chennai",
  },
  {
    quote:
      "You can tell these are written by professors — topics are explained the same way our lecturers teach them.",
    name: "Student, BCA",
    college: "Chennai",
  },
];

/** What students say — static quotes in the site's existing card style. */
export function Testimonials() {
  return (
    <section className="border-y border-hairline bg-bg-secondary py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <span className="eyebrow">In their words</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            What students say
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {quotes.map((t) => (
            <figure
              key={t.quote}
              className="flex flex-col border-t border-ink/70 bg-bg p-7"
            >
              <span
                aria-hidden
                className="font-serif text-5xl leading-none text-ink/25"
              >
                “
              </span>
              <blockquote className="mt-3 flex-1 font-serif text-lg italic leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold uppercase tracking-[0.1em] text-ink">
                  {t.name}
                </span>
                <span className="mt-0.5 block text-muted">{t.college}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
