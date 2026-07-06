import Image from "next/image";
import { Container } from "@/components/ui/Container";

/**
 * Editorial gallery — black & white, Rome-inspired academic imagery (classical
 * architecture, museum interiors, marble statues) for a premium publishing
 * house feel. Purely decorative.
 */
const shots = [
  {
    src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    alt: "Classical Roman columns and architecture",
    caption: "Roman architecture",
    className: "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto",
  },
  {
    src: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80",
    alt: "Marble statue in a museum gallery",
    caption: "Marble & museum",
    className: "aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=900&q=80",
    alt: "Grand classical museum interior",
    caption: "The museum hall",
    className: "aspect-square",
  },
];

export function GallerySection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <span className="eyebrow">A publishing house</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Made to be kept on a shelf
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Printed books, built to survive a semester of underlining,
            dog-earing and re-reading.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-4">
          {shots.map((shot) => (
            <figure
              key={shot.src}
              className={`group relative overflow-hidden rounded-sm border border-hairline bg-bg-secondary ${shot.className}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="img-zoom object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a140a]/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="absolute bottom-0 left-0 p-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
