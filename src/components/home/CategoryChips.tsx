import { Container } from "@/components/ui/Container";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { getCategories } from "@/lib/queries";

/**
 * Section 6 — Browse by course: outline pill chips from live categories.
 */
export async function CategoryChips() {
  const categories = await getCategories();

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Browse by course
        </h2>
        <p className="mt-2 text-muted">Find the right syllabus for your programme.</p>

        <div className="mt-6 flex flex-wrap gap-2.5">
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
