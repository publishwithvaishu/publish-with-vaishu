import { Container } from "@/components/ui/Container";
import { accentAt } from "@/lib/accents";

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
    <section className="py-14 sm:py-20">
      <Container>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          What students say
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-3">
          {quotes.map((t, i) => {
            const accent = accentAt(i);
            return (
              <figure
                key={t.quote}
                className={`flex flex-col rounded-2xl border bg-bg p-6 card-soft ${accent.border}`}
              >
                <span
                  aria-hidden
                  className={`font-serif text-4xl leading-none ${accent.text}`}
                >
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className={`font-medium ${accent.text}`}>{t.name}</span>
                  <span className="mt-0.5 block text-muted">{t.college}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
