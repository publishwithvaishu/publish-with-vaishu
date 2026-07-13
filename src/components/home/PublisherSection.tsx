import { Container } from "@/components/ui/Container";
import { getHomePublisher } from "@/lib/queries";

/**
 * "Meet Our Publisher" — a single featured publisher (lowest display-order
 * active record) with a large circular portrait, name, designation, a rich
 * description, and optional contact / social links. Renders nothing when no
 * active publisher exists, so the homepage is unchanged until one is added
 * in the admin.
 */
export async function PublisherSection() {
  const publisher = await getHomePublisher();
  if (!publisher) return null;

  const socials = [
    { href: publisher.website, label: "Website" },
    { href: publisher.linkedin, label: "LinkedIn" },
    { href: publisher.twitter, label: "Twitter" },
    { href: publisher.instagram, label: "Instagram" },
  ].filter((s) => !!s.href);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="text-center">
          <span className="eyebrow">The house</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Meet our publisher
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl items-center gap-10 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-14">
          <div className="mx-auto">
            {publisher.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={publisher.photo}
                alt={publisher.name}
                className="h-48 w-48 rounded-full object-cover shadow-[0_8px_30px_rgba(33,27,18,0.14)] sm:h-56 sm:w-56"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-bg-secondary font-serif text-5xl text-ink/40 sm:h-56 sm:w-56">
                {publisher.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              {publisher.name}
            </h3>
            {publisher.designation && (
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {publisher.designation}
              </p>
            )}
            {publisher.bio && (
              <p className="mt-5 whitespace-pre-line leading-relaxed text-muted">
                {publisher.bio}
              </p>
            )}

            {(socials.length > 0 || publisher.email) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm sm:justify-start">
                {publisher.email && (
                  <a
                    href={`mailto:${publisher.email}`}
                    className="font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
                  >
                    {publisher.email}
                  </a>
                )}
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
