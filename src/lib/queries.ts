import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BookDetail,
  BookWithRelations,
  CatalogParams,
  CatalogResult,
  Category,
  TrustStats,
} from "@/lib/types";

// Columns selected for a book card, joined with author name + category.
const BOOK_CARD_SELECT =
  "id, title, subtitle, price, stock, cover_image, language, course, university, is_featured, delivery_charge, " +
  "author:authors ( id, name ), category:categories ( id, name, slug )";

// Full set of columns + full author record for the detail page.
const BOOK_DETAIL_SELECT =
  "*, author:authors (*), category:categories ( id, name, slug )";

const DEFAULT_PAGE_SIZE = 12;

/** All categories for the "Browse by course" chips. */
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return data ?? [];
}

/** Featured books for the homepage grid. */
export async function getFeaturedBooks(limit = 8): Promise<BookWithRelations[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select(BOOK_CARD_SELECT)
    .eq("is_featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load featured books: ${error.message}`);
  return (data ?? []) as unknown as BookWithRelations[];
}

/** University of Madras prescribed titles row. */
export async function getPrescribedTitles(
  limit = 8,
): Promise<BookWithRelations[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select(BOOK_CARD_SELECT)
    .ilike("university", "%Madras%")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error)
    throw new Error(`Failed to load prescribed titles: ${error.message}`);
  return (data ?? []) as unknown as BookWithRelations[];
}

/**
 * Live counts for the trust statistics row. Counts come directly from the
 * public catalog tables (books, authors, categories) — all real data, no
 * placeholder figures. The private `users` table is never queried here.
 */
export async function getTrustStats(): Promise<TrustStats> {
  const supabase = getSupabaseServerClient();

  const [books, authors, categories] = await Promise.all([
    supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("authors").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  const firstError = books.error ?? authors.error ?? categories.error;
  if (firstError)
    throw new Error(`Failed to load trust stats: ${firstError.message}`);

  return {
    booksPublished: books.count ?? 0,
    authors: authors.count ?? 0,
    courses: categories.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
//  Catalog
// ---------------------------------------------------------------------------

const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Resolve a category slug to its id. Tolerant of hyphenation so both
 * `b-com` and `bcom` (and `m-sc` / `msc`) match the same category.
 */
async function resolveCategoryId(slugParam: string): Promise<string | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("categories").select("id, slug");
  const target = normalizeSlug(slugParam);
  const match = (data ?? []).find((c) => normalizeSlug(c.slug) === target);
  return match?.id ?? null;
}

/** Author ids whose name matches the search term (for title/author/ISBN search). */
async function findAuthorIdsByName(term: string): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", `%${term}%`);
  return (data ?? []).map((a) => a.id as string);
}

/**
 * Catalog query with search (title / author / ISBN), category filter,
 * price range, sort, and pagination. Reads only from the Supabase books table.
 */
export async function getBooks(params: CatalogParams): Promise<CatalogResult> {
  const supabase = getSupabaseServerClient();

  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("books")
    .select(BOOK_CARD_SELECT, { count: "exact" })
    .eq("published", true);

  // Category filter (by slug → id).
  if (params.category) {
    const categoryId = await resolveCategoryId(params.category);
    // Unknown category → return an empty result rather than everything.
    query = query.eq(
      "category_id",
      categoryId ?? "00000000-0000-0000-0000-000000000000",
    );
  }

  // Search across title, ISBN and author name.
  if (params.q && params.q.trim()) {
    // Strip characters that would break PostgREST's or() filter grammar.
    const term = params.q.trim().replace(/[,()*]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      const ors = [`title.ilike.${like}`, `isbn.ilike.${like}`];
      const authorIds = await findAuthorIdsByName(term);
      if (authorIds.length) ors.push(`author_id.in.(${authorIds.join(",")})`);
      query = query.or(ors.join(","));
    }
  }

  if (typeof params.minPrice === "number" && !Number.isNaN(params.minPrice)) {
    query = query.gte("price", params.minPrice);
  }
  if (typeof params.maxPrice === "number" && !Number.isNaN(params.maxPrice)) {
    query = query.lte("price", params.maxPrice);
  }

  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(`Failed to load books: ${error.message}`);

  const total = count ?? 0;
  return {
    books: (data ?? []) as unknown as BookWithRelations[],
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Minimal published-book list (id + timestamp) for the XML sitemap. */
export async function getPublishedBooksForSitemap(): Promise<
  { id: string; created_at: string | null }[]
> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select("id, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(`Failed to load books for sitemap: ${error.message}`);
  return (data ?? []) as { id: string; created_at: string | null }[];
}

/** A single book with its full author record + category, for the detail page. */
export async function getBookById(id: string): Promise<BookDetail | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select(BOOK_DETAIL_SELECT)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load book: ${error.message}`);
  return (data as unknown as BookDetail) ?? null;
}

/** Additional gallery images for a book's detail page (front cover is `books.cover_image`). */
export async function getBookImages(
  bookId: string,
): Promise<{ id: string; url: string }[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("book_images")
    .select("id, url")
    .eq("book_id", bookId)
    .order("position", { ascending: true });
  // Degrade to "no extra images" (single-cover page, today's behavior)
  // rather than crash the book page — covers the window before migration
  // 0008 has been run.
  if (error) {
    console.error("getBookImages failed:", error.message);
    return [];
  }
  return (data ?? []) as { id: string; url: string }[];
}

/** Books from the same category (excluding the current book). */
export async function getRelatedBooks(
  categoryId: string | null,
  excludeId: string,
  limit = 4,
): Promise<BookWithRelations[]> {
  if (!categoryId) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select(BOOK_CARD_SELECT)
    .eq("category_id", categoryId)
    .eq("published", true)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load related books: ${error.message}`);
  return (data ?? []) as unknown as BookWithRelations[];
}
