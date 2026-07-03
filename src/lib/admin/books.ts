import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Book } from "@/lib/types";

const ADMIN_BOOK_SELECT =
  "id, title, subtitle, isbn, edition, university, course, semester, language, " +
  "pages, publication_date, price, stock, cover_image, description, is_featured, " +
  "published, author_id, category_id, created_at, delivery_charge, " +
  "author:authors ( id, name ), category:categories ( id, name, slug )";

export interface AdminBook extends Book {
  published: boolean;
  author: { id: string; name: string } | null;
  category: { id: string; name: string; slug: string } | null;
}

export interface BookWrite {
  title: string;
  subtitle: string | null;
  isbn: string | null;
  edition: string | null;
  university: string | null;
  course: string | null;
  semester: string | null;
  language: string | null;
  pages: number | null;
  publication_date: string | null;
  price: number;
  stock: number;
  description: string | null;
  author_id: string | null;
  category_id: string | null;
  is_featured: boolean;
  published: boolean;
  cover_image?: string | null;
  /** Manual per-book delivery charge. null = use the site default rule. */
  delivery_charge: number | null;
}

const DEFAULT_PAGE_SIZE = 8;

export interface AdminBookList {
  books: AdminBook[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function resolveCategoryId(slug: string): Promise<string | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from("categories").select("id, slug");
  const target = normalizeSlug(slug);
  return (data ?? []).find((c) => normalizeSlug(c.slug) === target)?.id ?? null;
}

async function authorIdsByName(term: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", `%${term}%`);
  return (data ?? []).map((a) => a.id as string);
}

/** All books (published + unpublished) for the admin list. */
export async function adminListBooks(params: {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminBookList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("books")
    .select(ADMIN_BOOK_SELECT, { count: "exact" });

  if (params.category) {
    const id = await resolveCategoryId(params.category);
    query = query.eq(
      "category_id",
      id ?? "00000000-0000-0000-0000-000000000000",
    );
  }

  if (params.q && params.q.trim()) {
    const term = params.q.trim().replace(/[,()*]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      const ors = [`title.ilike.${like}`, `isbn.ilike.${like}`];
      const ids = await authorIdsByName(term);
      if (ids.length) ors.push(`author_id.in.(${ids.join(",")})`);
      query = query.or(ors.join(","));
    }
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    books: (data ?? []) as unknown as AdminBook[],
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function adminGetBook(id: string): Promise<AdminBook | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select(ADMIN_BOOK_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as AdminBook) ?? null;
}

export async function adminCreateBook(write: BookWrite): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("books")
    .insert(write)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function adminUpdateBook(
  id: string,
  write: BookWrite,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  // Drop cover_image when undefined so we don't overwrite an existing cover.
  const patch: Record<string, unknown> = { ...write };
  if (write.cover_image === undefined) delete patch.cover_image;
  const { error } = await supabase.from("books").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminDeleteBook(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminSetPublished(
  id: string,
  published: boolean,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("books")
    .update({ published })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminUpdateStock(
  id: string,
  stock: number,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("books").update({ stock }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminListAuthors(): Promise<
  { id: string; name: string }[]
> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; name: string }[];
}

// ---------------------------------------------------------------------------
//  Book image gallery (additional photos — e.g. back cover)
// ---------------------------------------------------------------------------

export interface BookImage {
  id: string;
  url: string;
}

export async function adminGetBookImages(bookId: string): Promise<BookImage[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("book_images")
    .select("id, url")
    .eq("book_id", bookId)
    .order("position", { ascending: true });
  // Degrade to "no extra images" rather than crash the whole edit page —
  // covers the window before migration 0008 has been run.
  if (error) {
    console.error("adminGetBookImages failed:", error.message);
    return [];
  }
  return (data ?? []) as BookImage[];
}

/** Append images to a book's gallery, positioned after any existing ones. */
export async function adminAddBookImages(
  bookId: string,
  urls: string[],
): Promise<void> {
  if (urls.length === 0) return;
  const supabase = getSupabaseAdminClient();

  const { data: existing, error: countError } = await supabase
    .from("book_images")
    .select("position")
    .eq("book_id", bookId)
    .order("position", { ascending: false })
    .limit(1);
  if (countError) throw new Error(countError.message);

  const startPosition = ((existing?.[0]?.position as number) ?? -1) + 1;
  const rows = urls.map((url, i) => ({
    book_id: bookId,
    url,
    position: startPosition + i,
  }));

  const { error } = await supabase.from("book_images").insert(rows);
  if (error) throw new Error(error.message);
}

export async function adminDeleteBookImage(imageId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("book_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
}
