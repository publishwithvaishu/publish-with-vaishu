import { Container } from "@/components/ui/Container";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { getCategories } from "@/lib/queries";

/**
 * Section 6 — Browse by course: outline pill chips from live categories.
 */
export async function CategoryChips() {
  const categories = await getCategories();

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="text-center">
          <span className="eyebrow">By programme</span>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Browse by course
          </h2>
          <p className="mt-3 text-muted">
            Find the right syllabus for your programme.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              href={`/books?category=${category.slug}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
