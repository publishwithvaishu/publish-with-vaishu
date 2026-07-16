import { Container } from "@/components/ui/Container";
import { getHomePublisher } from "@/lib/queries";

/**
 * Meet Our Publisher — same live record as before (getHomePublisher),
 * restyled as a single premium dark card with a gold-ring portrait.
 * Renders nothing when no active publisher exists (unchanged behavior).
 */
export async function DarkPublisher() {
  const publisher = await getHomePublisher();
  if (!publisher) return null;

  const socials = [
    { href: publisher.website, label: "Website" },
    { href: publisher.linkedin, label: "LinkedIn" },
    { href: publisher.twitter, label: "Twitter" },
    { href: publisher.instagram, label: "Instagram" },
  ].filter((s) => !!s.href);

  return (
    <section className="pt-14">
      <Container>
        <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
          Meet Our Publisher
        </h2>
        <div className="card-dark mt-5 overflow-hidden rounded-3xl">
          <div className="grid items-center gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-9">
            <div className="mx-auto sm:mx-0">
              {publisher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publisher.photo}
                  alt={publisher.name}
                  className="h-36 w-36 rounded-full border-2 border-[#e8b647]/60 object-cover shadow-[0_0_34px_-10px_rgba(232,182,71,0.55)] sm:h-44 sm:w-44"
                />
              ) : (
                <span className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#e8b647]/40 bg-white/5 font-serif text-4xl text-gold sm:h-44 sm:w-44">
                  {publisher.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {publisher.name}
              </h3>
              {publisher.designation && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {publisher.designation}
                </p>
              )}
              {publisher.bio && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {publisher.bio}
                </p>
              )}
              {(socials.length > 0 || publisher.email) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                  {publisher.email && (
                    <a
                      href={`mailto:${publisher.email}`}
                      className="glass-dark rounded-full px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-[#e8b647]/40"
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
                      className="glass-dark rounded-full px-4 py-1.5 text-xs font-medium text-gold transition-colors hover:border-[#e8b647]/40"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
